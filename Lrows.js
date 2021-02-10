const Discord = require("discord.js")
const client = new Discord.Client()
const ayarlar = require("./ayarlar.json")
const chalk = require("chalk")
const fs = require("fs")
const moment = require("moment")
const db = require("quick.db")
const request = require("request")
const ms = require("parse-ms")
const express = require("express")
const http = require("http")
const app = express()
const logs = require("discord-logs")
require("moment-duration-format")
logs(client)
require("./util/eventLoader")(client)
var prefix = ayarlar.prefix
const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.gif = {
kategoriler: ["805130975868092456","805131062321348638","805131009783496704","805131418404388885","805131237169430558","805131860132626532","805131163818917920","805131367901298700","805131283502989312","805131675222278174","805131120039166003","805131458728951829","805131748232396840","805131574315188295","805131625985081416","805131948988039198","793466504158117959","805139047072661614",], //gif kategori idleri
  log: "807533668024975380", //Gif-Log (kanal id)
  sunucu: "GIF HERAKLES", //Sunucunuzun İsmi
  rastgele: {
    PP: "793176691551371264", //Random PP (kanal id)
    GIF: "793176690486542346" //Random Gif (kanal id)
  }
  
}
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });//Lrows
      resolve();
    } catch (e) {
      reject(e);
    }//Lrows
  });
};
client.on('message', async msg =>{

  let categories = client.gif.kategoriler
  
  if(msg.attachments.size == 0&&categories.includes(msg.channel.parentID)){
  
  if(msg.author.bot) return;
  
  msg.delete({timeout:1000})
  //Lrows
  msg.reply('Bu kanalda sadece pp/gif paylaşabilirsin!').then(m=>m.delete({timeout:5000}))
  //Lrows
}
  if(msg.attachments.size > 0 && categories.includes(msg.channel.parentID)){
//Lrows
  db.add(`sayı.${msg.author.id}`,msg.attachments.size)
  let emojis = ['⭐','🌙','⚡','🌌','💸']//Lrows
  var random = Math.floor(Math.random()*(emojis.length));
  let pp = 0
  let gif = 0
  msg.attachments.forEach(atch=>{
   if(atch.url.endsWith('.webp')||atch.url.endsWith('.png')||atch.url.endsWith('.jpeg')||atch.url.endsWith('.jpg')){
     db.add(`pp.${msg.author.id}`,1)//Lrows
     pp = pp + 1//Lrows
   }
    if(atch.url.endsWith('.gif')){//Lrows
     db.add(`gif.${msg.author.id}`,1)
      gif = gif +1//Lrows
    }
  })
  let mesaj = ``//lrows
  if(gif > 0 && pp === 0){
    mesaj = `${gif} gif`
  }//lrows
if(pp > 0 && gif === 0){
    mesaj = `${pp} pp`//lrows
  }
if(gif > 0 && pp > 0){
    mesaj = `${pp} pp, ${gif} gif`//lrows
  }
  client.channels.cache.get(client.gif.log).send(new Discord.MessageEmbed().setColor('RANDOM').setAuthor(client.gif.sunucu +' 🔥').setDescription(`<a:kelebek:807531093858451469> \`•\` **${msg.author.tag}** (\`${msg.author.id}\`) **Adlı Üye** ,\n<#${msg.channel.id}> **kanalına ${mesaj} gönderdi.**\n**Bu kişi şuanda kanallara toplam ${db.fetch(`sayı.${msg.author.id}`)||0} pp/gif göndermiş.**`))
}//lrows
})

client.elevation = message => {
  if (!message.guild) {//Lrows
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;//Lrows
  if (message.author.id === ayarlar.sahip) permlvl = 4;//Lrows
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;//Lrows

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.on('ready',()=>{
  let oynuyorlrows = 
      ['Just Somehow survive Misha!',]
    setInterval(function() {

        var random = Math.floor(Math.random()*(oynuyorlrows.length-0+1)+0);

        client.user.setActivity(oynuyorlrows[random],{type:'PLAYING'});
        }, 2 * 5000);
  setTimeout(()=>{
     client.user.setStatus("idle");

  },100)
  
});
console.log('Bot Başarıyla Aktif Edildi by Lrows')
client.login(process.env.token).catch(err=> console.error('Tokeni Yenileyip Tekrar Girin'));
