import {RpcCommand} from '../../lib/rpc-command'

export default class AccountLock extends RpcCommand {
  static description = 'Lock an account'

  static args = [{
    name: 'address',
    description: 'Address of the account to lock',
    required: true,
  }]

  static flags = {
    ...RpcCommand.flags,
  }

  async run() {
    const {args, flags} = this.parse(AccountLock)

    const {metadata} = await this.call(AccountLock, 'lockAccount', [args.address])

    this.log(`Account locked: ${args.address}`)
    this.showMetadataIfRequested(metadata, flags)
  }
}
