import RedditCommand from '../../core/redditCommand';
import Bot from '../../core/bot';

export default class Dank extends RedditCommand {
  constructor(client: Bot) {
    super(client);
    this.name = 'dank';
    this.sub = 'dankmemes';
    this.category = 'memes';
  }
}
