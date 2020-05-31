import { Client, Message } from 'discord.js';
import Command from '../../core/command';

export default class Noot extends Command {
  constructor() {
    super();
    this.name = 'noot';
  }

  public async exec(client: Client, message: Message): Promise<void> {
    message.reply('noot!');
  }
}
