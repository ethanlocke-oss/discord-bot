const { asyncForEach } = require("../functions");
const levelRoles = require("../constants/levelRanks");
const User = require("../database/models/userModel");

// Create the roles on the server
const initializeLevelRoles = async message => {
  const { guild, channel, author, content } = message;

  const triggerMessage = `${process.env.BOT_PREFIX} initialize leveling system`;

  const numOfRanks = levelRoles.length;
  let rolesInitialized = 0;

  if (author.id === guild.owner.id && content === triggerMessage) {
    await asyncForEach(levelRoles, async ({ name, color, level }) => {
      try {
        await guild.createRole({
          name,
          color,
          position: level,
          hoist: true
        });
        rolesInitialized += 1;
        console.info(`Successfully created the '${name}' role!`);
      } catch (error) {
        console.info(`There was an error creating the '${name}' role`);
      }
    });

    if (rolesInitialized === numOfRanks) {
      channel.send(
        "The leveling system has been initialized - let the games begin!"
      );
    } else
      channel.send(
        "Something might have gone wrong -I couldn't initialize all of the ranks..."
      );
  }
};

// Check if record exits / create one
const getUserRecord = async userId => {
  try {
    const result = await User.findOne({ userId });
    // If a user record exists - return it
    if (result) return result;

    // Otherwise create a new record and return that
    const newRecord = await new User({
      userId,
      experience: 0
    }).save();

    return newRecord;
  } catch (error) {
    throw error;
  }
};

const calculateExperience = message => {
  const { embeds, attachments } = message;
  if (attachments.length > 0) return 21;
  if (embeds.length > 0) return 14;
  return 7;
};

const updateRole = async (message, userExperience) => {
  const { guild, member, channel } = message;

  const currentLevel = userExperience / 100;

  let roleName = "";
  levelRoles.forEach(({ level, name }) => {
    if (currentLevel > level) roleName = name;
  });

  // Get the role object
  const role = guild.roles.find(r => r.name === roleName);

  if (role) {
    const alreadyHasRole = member.roles.has(role.id);

    if (!alreadyHasRole) {
      try {
        await member.addRole(role);
        channel.send(
          `Congratulations ${member}! You've ascended to a ${role.name}!`
        );
      } catch (error) {
        channel.send(
          `${member} leveled up but there was an error granting their rank!`
        );
      }
    }
  } else {
    // Role doesn't exist - leveling system hasn't been initialized
    return false;
  }
};

const incrementExperience = async message => {
  try {
    // Get the users information
    const { author } = message;
    const userRecord = await getUserRecord(author.id);
    const { experience: currentExperience } = userRecord;

    // Update their record with experience gained
    const experienceGained = calculateExperience(message);
    const updatedExperience = currentExperience + experienceGained;
    await userRecord.updateOne({
      experience: updatedExperience
    });

    // Check and update their role
    await updateRole(message, updatedExperience);
  } catch (error) {
    message.channel.send(
      `Sorry ${message.author}, there was a problem incrementing your experience`
    );
  }
};

const getUserLevelInfo = async message => {
  try {
    const { author } = message;
    const user = await User.findOne({ userId: author.id });

    if (user) {
      const { experience } = user;
      const currentLevel = Math.floor(Number(experience / 100));
      const expToNextLevel = (currentLevel + 1) * 100 - experience;

      return {
        currentLevel,
        experience,
        expToNextLevel
      };
    }
  } catch (error) {
    message.channel.send(
      `Sorry ${author}! There was a problem retreiving your user record...`
    );
  }
};

module.exports = {
  initializeLevelRoles,
  incrementExperience,
  getUserLevelInfo
};
