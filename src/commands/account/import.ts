import {flags} from '@oclif/command'
import {RpcCommand} from '../../lib/rpc-command'

export default class AccountImport extends RpcCommand {
  static description = 'Import an account by its private key'

  static args = [{
    name: 'privatekey',
    description: 'Private key in HEX or Base64 format',
    required: true,
  }]

  static flags = {
    ...RpcCommand.flags,
    password: flags.string({
      description: 'Password to encrypt the key',
      default: '',
    }),
    unlock: flags.boolean({
      description: 'Unlock the account after import',
    }),
  }

  async run() {
    const {args, flags} = this.parse(AccountImport)

    const {data: address, metadata: importMetadata} = await this.call(
      AccountImport,
      'importRawKey',
      [args.privatekey, flags.password || null],
    )

    let unlockMetadata
    if (flags.unlock) {
      this.log('Key imported, unlocking...');
      ({metadata: unlockMetadata} = await this.call(
        AccountImport,
        'unlockAccount',
        [address, flags.password || null, /* duration */ null],
      ))
    }

    this.log(`Account imported: ${address} (${flags.unlock ? 'unlocked' : 'locked'})`)
    this.showMetadataIfRequested(importMetadata, flags, flags.unlock ? 'Import' : undefined)
    if (flags.unlock) {
      this.showMetadataIfRequested(unlockMetadata, flags, 'Unlock')
    }
  }
}
