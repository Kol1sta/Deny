import { GuildMember, EmbedBuilder } from 'discord.js';
import { EventItem, EventItemOptions } from '../services/events';

const options: EventItemOptions = {
    isOnce: false,
    name: 'guildMemberAdd'
}

export default new EventItem(options, async (member: GuildMember) => {
    try {
        const channel = await member.guild.channels.fetch(process.env.JOIN_CHANNEL_ID!);

        if(!channel || !channel.isTextBased()) {
            console.error('Канал не найден или не текстовый');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Добро пожаловать ₊˚✦')
            .setDescription(`- <@${member.id}>, Добро пожаловать на ${member.guild.name}              
- Обязательно прочитайте <#1410389079240999014> и <#1410389051197886575>
- Приятного общения`)
            .setColor(0xFFF4D8)
            .setImage("https://media.discordapp.net/attachments/1404398593850474529/1415676035256680448/056c584d9335fcabf080ca43e583e3c4.gif?ex=68c4128c&is=68c2c10c&hm=2c57f3f273c1ec8fdf66e20d60ed1e20fef427d16784ae7442aa5c7bc8875fcd&=")
            .setFooter({ text: member.guild.name, iconURL: member.user.avatarURL() || undefined })
            .setTimestamp()

        await channel.send({ content: `||<@${member.id}><@&1415678986121515058>||`, embeds: [embed] });
    } catch {
        console.log('Ошибка в guildMemberAdd');
    }
});