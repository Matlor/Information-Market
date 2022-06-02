import { gql, sudograph } from 'sudograph';
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { LoremIpsum } from "lorem-ipsum";
import { graphQlToJsDate, jsToGraphQlDate } from "./conversions";

var sudographActor = sudograph({
  canisterId: `${process.env.GRAPHQL_CANISTER_ID}`
});

async function getNumberQuestions() : Promise<number>{
  const result = await sudographActor.query(gql`
    query {
      readQuestion
        { id }
    }`);
  console.debug("Read questions: " + JSON.stringify(result));
  if (result.data == null){
    return 0;
  } else {
    return result.data.readQuestion.length;
  }
};

async function createInvoice(buyer: String) : Promise<String>{
  const result = await sudographActor.mutation(gql`
    mutation ($buyer: String!) {
      createInvoice(input: {buyer: $buyer}
      ) { id }
    }`, { buyer });
  console.debug("Create invoice: " + JSON.stringify(result));
  return result.data.createInvoice[0].id;
};

async function createQuestion(author: String, invoice_id: String, creation_date: number, open_duration: number, title: String, content: String, reward: number): Promise<String>{
  const result = await sudographActor.mutation(gql`
    mutation ($author: String!, $invoice_id: ID!, $creation_date: Int!, $open_duration: Int!, $title: String!, $content: String!, $reward: Int!) {
      createQuestion(
        input: {author: $author, author_invoice: {connect: $invoice_id}, creation_date: $creation_date, status: OPEN, status_update_date: $creation_date, open_duration: $open_duration, title: $title, content: $content, reward: $reward}
      ) { id }
    }`,{ author, invoice_id, creation_date, open_duration, title, content, reward });
  console.debug("Create question: " + JSON.stringify(result));
  return result.data.createQuestion[0].id;
};

async function createAnswer(question_id: String, author: String, creation_date: number, content: String): Promise<String>{
  const result = await sudographActor.mutation(gql`
    mutation ($question_id: ID!, $author: String!, $creation_date: Int!, $content: String!) {
      createAnswer(
        input: {question: {connect: $question_id}, author: $author, creation_date: $creation_date, content: $content}
      ) { id }
    }`, { question_id, author, creation_date, content });
  console.debug("Create answer: " + JSON.stringify(result));
  return result.data.createAnswer[0].id;
};

async function setWinner(question_id: String, answer_id: String): Promise<String>{
  const result = await sudographActor.mutation(gql`
    mutation ($question_id: ID!, $answer_id: ID!) {
      updateQuestion(
        input: {id: $question_id, winner: {connect: $answer_id}}
      ) { id }
    }`, { question_id, answer_id });
  console.debug("Set winner: " + JSON.stringify(result));
  return result.data.updateQuestion[0].id;
}

async function setStatus(question_id: String, status: String, status_update_date: number): Promise<String>{
  const result = await sudographActor.mutation(gql`
    mutation ($question_id: ID!, $status_update_date: Int!, $status: QuestionStatus!) {
      updateQuestion(
        input: {id: $question_id, status_update_date: $status_update_date, status: $status}
      ) { id }
    }`, { question_id, status, status_update_date });
  console.debug("Set status: " + JSON.stringify(result));
  return result.data.updateQuestion[0].id;
}

function generateUsers(names: Array<String>) {
  var array : Array<{name: String, identity: String}> = new Array();
  for (var i = 0; i < names.length; ++i) {
    array.push({name: names[i], identity: Ed25519KeyIdentity.generate().getPrincipal().toString()})
  };
  return array;
};

function getRandomPastDate(minutesFromNow: number) {
  return jsToGraphQlDate(Date.now() - (Math.floor(Math.random() * minutesFromNow * 60000) + 1));
}

function getRandomDuration(maxDuration: number) {
  return Math.floor(Math.random() * maxDuration) + 1;
}

function getRandomReward(minReward: number, maxReward: number) {
  return Math.floor(Math.random() * (maxReward - minReward) + minReward + 1);
}

const loadScenario = async (
  names: Array<String>,
  questionNumber: number,
  minutesInPast: number,
  minutesToGo: number,
  minReward: number,
  maxReward: number) => {

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 4,
      min: 2
    },
    wordsPerSentence: {
      max: 12,
      min: 4
    }
  });

  let now = jsToGraphQlDate(Date());
  
  console.debug("Start loading scenario...");

  let numToCreate = Math.max(questionNumber - await getNumberQuestions(), 0);
  console.debug("Add " + numToCreate + " question(s) from " + names.length + " users.");
  
  let questionMap = new Map<String, Set<String>>();

  for (let i = 0; i < numToCreate; i++){
    var users = generateUsers(names);
    let creationDate = getRandomPastDate(minutesInPast);
    let questionAuthor = users.splice(Math.floor(Math.random() * users.length), 1)[0];
    let question = await createQuestion(
      questionAuthor.name,
      await createInvoice(questionAuthor.identity),
      creationDate,
      (now - creationDate) + getRandomDuration(minutesToGo),
      lorem.generateWords(),
      lorem.generateSentences(),
      getRandomReward(minReward, maxReward)
    );
    console.debug("Question from: " + questionAuthor.name);

    let answerSet = new Set<String>();
    while(users.length > 0)
    {
      let author = users.splice(Math.floor(Math.random() * users.length), 1)[0];
      
      // Half pourcentage of chance to give an answer
      if (Math.floor(Math.random() * 2))
      {
        answerSet.add(await createAnswer(question, author.name, getRandomPastDate(now - creationDate), lorem.generateSentences()));
        console.debug("Answer from: " + author.name);
      }
    }

    questionMap.set(question, answerSet);
  }

  // TODO: right now, the status update date might be before the question's creation date or answers' dates
  for (let [question, answers] of questionMap) {

    let rand = Math.floor(Math.random() * 100) + 1;
    
    if (rand < 40){ // 40% of questions will be OPEN
      continue;
    }
    else if (rand < 55){ // 15% of questions will be PICKANSWER
      await setStatus(question, "PICKANSWER", getRandomPastDate(minutesInPast));
    }
    else if (rand < 75){ // 20% (max) of questions will be DISPUTABLE
      if (answers.size == 0){
        await setStatus(question, "CLOSED", getRandomPastDate(minutesInPast));
      } else {
        await setWinner(question, [...answers][0]);
        await setStatus(question, "DISPUTABLE", getRandomPastDate(minutesInPast));
      }
    }
    else if (rand < 90){ // 15% (max) of questions will be DISPUTED
      if (answers.size == 0){
        await setStatus(question, "CLOSED", getRandomPastDate(minutesInPast));
      } else {
        // Half of the disputed questions won't have a picked winner,
        // to simulate when the question's author didn't pick any winner
        if (Math.floor(Math.random() * 2)){
          // This will pick a winning answer randomly, since it's based on the answer identifier
          await setWinner(question, [...answers][0]);
        }
        await setStatus(question, "DISPUTED", getRandomPastDate(minutesInPast));
      }
    }
    else{ // 10% (min) of questions will be CLOSED
      await setStatus(question, "CLOSED", getRandomPastDate(minutesInPast));
    }
  };

  console.debug("Loading scenario finished!");
};

export default {
  loadScenario
};
