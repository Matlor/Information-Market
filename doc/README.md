# Information-Market

## Overview

### Problem: Asking questions online is ridiculously hard!

Closed online communities

- Forums are topic specific
- Forums require reputation (Karma)

Lack of incentives

- Low-quality answers
- Long response-times

Built on web2 stack

- No ability to use micropayments globally
- No ability to reduce platform risks for third parties

### Solution

A decentralized information market built on the ICP that uses micropayments to reward great answers.

- High incentives to give great answers
- High incentives to answer quickly
- No reputation required

Built on the ICP

- Allows to use micropayments globally.
- Allows to build an open system by reducing platform risk for third-party services.

### Vision

A market for information that feels like an extended mind to the end-user.

## Core Mechanism

The main user flow can be divided into the following 7 stages.

### Login & Wallet

The user connects a wallet such as Plug to the front-end.

### Question

The user can ask a question by specifying 3 different things:

- A reward in ICP
- The duration/deadline of the question
- The content of the question

After doing so, the user is requested to pay the reward in ICP using the connected wallet. Here we could probably use something like [Quark](https://www.notion.so/Quark-Testnet-30980b5dd38b448eba25cd8aa6d20bb3) (departure labs) or the [invoice canister](https://forum.dfinity.org/t/payments-invoice-canister-design-review/9843/11).

As soon as the reward is transferred, the question is open to receive answers. The payment of the user will be locked until the payout stage is reached.

### Answers

As soon as the question is open people can answer it to become eligible for winning the reward. We’d most likely require them to log in to the application as well. What we certainly need from them is an account identifier to payout rewards.

### Picking the Winner

After the duration of the question, the questioner will get some additional time (fraction of the duration) to pick a winner. That brings up several issues:

- What gives them incentives to pick a winner after all?
- What if they try to game the system by rewarding themselves on a different account?
- What if their choice is simply objectively bad?

An arbitration mechanism is needed that can objectively pick a winner in case the questioner fails to make an objective choice.

To incentivize the questioner for picking an answer we could require them to deposit an additional amount, that they would get back if either nobody objects against their choice or if the resulting arbitration process confirms it.

### Dispute

After the questioner got the opportunity to pick a winner, everyone that gave an answer to the question could start a dispute. If the questioner did not pick any answer, the dispute mechanism would be triggered automatically.

To prevent spam, triggering the dispute mechanism could require a minor deposit as well that would be refunded in case they win the arbitration process.

### Arbitration

A decentralized arbitration mechanism already exists on Ethereum called [Kleros](https://kleros.io/). It roughly works in the following way:

- People have to stake a token to become a juror.
- For each case, a specific number of jurors is drawn from the pool.
- Each juror votes on the different options without knowing what the others have voted for.
- The option with the most votes wins.
- The jurors that voted for the winning option get a reward.

Whoever loses the dispute would need to pay for the jurors involved in the arbitration.

This approach would require a sufficiently high number of jurors though for each case to work well. For low-value transactions scaling the arbitration process could work by adding more instances to the court process, where the initial arbitration is being done by only one juror. That juror would accumulate fees over time without them being paid out directly. A Kleros-style court could have the option to confiscate the fees, in case someone triggers a case against the juror.

### Payout

The reward for the best answer, the reward for the arbiter, and in some cases the deposit of the questioner should be paid out immediately after the arbitration process.

### Potential Challenges

Generally, I would say a lot depends on how frictionless the whole payment process could work. The easier that is the more we can use small payments to solve a variety of issues.

## Supernova MVP

To start we should radically reduce the complexity described above. We can still add more complexity later on. I’d begin with the following basic version:

- Focus on 1 topic. Probably the ICP itself
- Focus on 1 wallet (Plug or Stoic probably)
- Rudimentary front-end
- Use an existing solution for the payments flow
- Start with two canisters only (front-end and back-end)
- Centralized arbitration (we pick the winners)

## Competition and USP

### Competition (incomplete)

- Quora
- Reddit
- Stack Overflow
- Stack Exchange
- Chegg
- Fiverr
- JustAnswer

### Unique Selling Proposition

Paying money for an answer ultimately is friction for a user. They will only be willing to pay if we can signal clear advantages for doing so. The forum has to be much better for specific types of questions than the competition. Ultimately a paid forum will have 3 main advantages:

- Speed: Get answers immediately
- Quality: Get great answers
- Diversity (eventually): Ask anything (no reputation needed)

Personally, I think initially speed could be the easiest thing to give users a high assurance before they have even tried the service. Quality is something they would experience when using the application for a while.

## The Long-Term Vision

The following is absolutely NOT relevant for the hackathon. It is nevertheless, Infinitely more interesting to work on something that could turn out to be valuable. The following two sections are experimental ideas on how to build out the idea.

### Services

Everything that is not the core mechanism should be opened up to external parties, possibly involving micropayments. I consider everything to be a service that sits between the mind of the person asking a question and the minds of the ones answering.

One such service could be the routing of questions. A question should be brought to people that are most likely able to answer it (lowest costs). Third parties should therefore be allowed to filter specific questions from the entire pool. People answering could be following specific filtered lists and either paying the service provider for each question they see or, more complicated, paying them if they win a reward as a result of following that list.

Other services could include:

- front-ends
- language translation
- voice message transcription
- integrations with web2 (pay with a credit card, use on Discord, Twitter, etc.)

I think the IC allows these services to interact with each other and reduces issues around trust and platform risk. A vast network of services that are topic-specific and built on top of each other could be the result.

### Bootstrapping the platform

Bootstrapping a global platform around information exchange while competing against Quora, Stack Overflow, etc. seems like an uphill battle. The properties of the IC could allow us to have an unfair advantage though by using the following strategy:

- Allow partners to claim a topic, build up the market around it and monetize its network effects.
- As all interactions are on-chain partners would trust to receive what is promised to them if the system is properly designed.
- This creates buy-in from partners.
- The adoption of a specific topic has spillover effects on others.
- This makes it more rational to become a partner the more partners have already committed.
- Once enough partners join the platform a self-reinforcing dynamic could be triggered.
- This design is the digital equivalent of a franchising model.
- The global nature of the design makes it much more powerful though.

I wrote about this topic [here](https://uxdesign.cc/50-million-partners-8082dc0b0b54?source=your_stories_page-------------------------------------).

Such a design could allow a platform to attract users much more quickly. The design would require a lot more work though.
