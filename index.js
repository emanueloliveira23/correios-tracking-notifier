
const robots = {
  userInput: require('./robots/userInput'),
  tracker: require('./robots/tracker'),
  advisor: require('./robots/advisor')
};

async function delay({ interval }) {
  return new Promise(resolve => setTimeout(resolve, interval));
}

async function main() {

  const content = { };

  robots.userInput(content);
  console.log('Start trakcing for: ', content);

  while (true) { 
    console.log('Veryfing object: ', content);
    await robots.tracker(content);
    await robots.advisor(content);
    await delay(content);
  }

}

main();
