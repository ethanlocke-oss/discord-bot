import { Message, MessageEmbed } from 'discord.js';
import RPGCommand from '../../core/rpgCommand';
import Bot from '../../core/bot';

export default class Stats extends RPGCommand {
  constructor() {
    super();
    this.name = 'stats';
    this.aliases = ['profile'];
    this.category = 'rpg';
  }

  public async exec(client: Bot, message: Message): Promise<void> {
    try {
      const {
        member: { id: userId, user, displayName }
      } = message;

      const avatar = await this.getUserAvatar(userId);

      const { hitPoints, maxHitPoints, armour, attack, exp, coins } = avatar;

      const currentLevel = this.getCurrentLevel(exp);
      const expToNextLevel = this.getExpForNextLevel(currentLevel);
      const percentProgress = Math.round((exp / expToNextLevel) * 100 * 10) / 10;

      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail(user.avatarURL())
        .setAuthor(`${displayName}'s avatar`, user.avatarURL())
        .addField(
          'Meta',
          `**Level:** ${currentLevel} (${percentProgress}%)
        **XP:** ${exp}/${expToNextLevel}
        `
        )
        .addField(
          'Stats',
          `**HP:** ${hitPoints}/${maxHitPoints}
        **DEF:** ${armour}
        **ATT:** ${attack}`
        )
        .addField('Inventory', `**Coins:** ${coins}`);

      message.channel.send(embed);
    } catch (error) {
      client.logger.error('Error caught in the STATS command: ', error);
    }
  }
}
