const expect = require('chai').expect;
const ganache = require('ganache-core');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

// Contracts
const contract = require('../src/compile');

describe('Inbox', () => {
  const defaultArguments = ['Meu primeiro contrato'];
  const defaultContract = {
    data: contract.bytecode,
    arguments: defaultArguments
  };

  let accounts;
  let inbox;

  const retriveMessage = async (inbox) => inbox.methods.message().call();

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(contract.interface))
      .deploy(defaultContract)
      .send({ from: accounts[0], gas: 1000000 });
  });

  it('Deploy a contract', async () => {
    expect(inbox.options.address).to.be.ok;
  });

  it('Default message', async () => {
    const retrivedMessage = await retriveMessage(inbox);

    expect(retrivedMessage).to.equal(defaultArguments[0]);
  });

  it('Changing message', async () => {
    const newMessage = 'New Message';
    await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });
    const retrivedMessage = await retriveMessage(inbox);

    expect(retrivedMessage).to.equal(newMessage);
  });
});
