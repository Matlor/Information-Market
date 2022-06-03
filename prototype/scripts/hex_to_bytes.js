#!/usr/bin/env node

function hexToBytes() {
  const args = process.argv.slice(2);
  const hex = args[0];

  for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

process.stdout.write(hexToBytes().toString().replaceAll(",", ";"));
