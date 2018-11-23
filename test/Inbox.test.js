const assert = require('assert');
const ganache = require('ganache-core');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

// Contracts
const contract = require('../src/compile');

let accounts;
let inbox;
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(contract.interface))
        .deploy({
            data: contract.bytecode,
            arguments: ['Meu primeiro contrato']
        })
        .send({ from: accounts[0], gas: 1000000 });
});

describe('Inbox', () => {
    it('Deploy a contract', async () => {
        assert.ok(inbox.options.address);
    });

    it('Default message', async () => {
        const msg = await inbox.methods.message().call();
        assert.equal(msg, 'Meu primeiro contrato');
    });

    it('Changing message', async () => {
        const newMessage = 'New Message';
        await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });
        const msg = await inbox.methods.message().call();
        assert.equal(msg, newMessage);
    });
});
