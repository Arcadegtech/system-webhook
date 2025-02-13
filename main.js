const { WebhookClient , Colors } = require('discord.js');
const { sequelize , valueKeys } = require('./sqlite/sqlite');
const config = require('./config.json');
const si = require('systeminformation');
const os = require('os');
const wait = require('node:timers/promises').setTimeout;
//webhook
const Wsender = new WebhookClient({ url: config.webhookUrl });
//Mapping
valuePairs = new Map()
allvalues = new Map()
//
let trying = 0
//SQLITE3
setTimeout(async () => {
    await sequelize.authenticate();
    await valueKeys.sync({ alter: true });
    await valueKeys.findOrCreate({ where: { key: 'webhookID' }, defaults: { value: 'Not_Set' } })
        .then(t => {
            if (!t[0]) return  valuePairs.set('webhookID',"NA");
            valuePairs.set(t[0].dataValues.key,t[0].dataValues.value)
        });
},200)
//Fetch Webhook interval
setInterval(async () => {
    await si.currentLoad()
        .then(data => allvalues.set('cpuspeed',data))
        .catch(error => console.error(error));
    //
    await si.mem()
        .then(data => allvalues.set('mem',data))
        .catch(error => console.error(error));
    await wait(1000)
    //
    Wsender.fetchMessage(valuePairs.get('webhookID'))
        .then(r => {
            //console.log(`Old Webhook Found`);
            Wsender.editMessage(valuePairs.get('webhookID'), {
                embeds: [
                    {  color: Colors.White , title: `${os.hostname()}` ,
                    description: `Platform :  \`${os.platform()}\`\nRelease :  \`${os.release()}\`\nVersion :  \`${os.version()}\`\nCPU Model :  \`${os.cpus()[0].model}\``,
                    thumbnail: { url: config.thumbnail },
                    fields: [
                        {  name: '\u200b', value: `\`\`\`CPU\`\`\``, inline: false, },
                        {   name: 'Total Usage %', value: `> ${Math.round(allvalues.get('cpuspeed').currentLoad * 100)/100}`, inline: true  },
                        {   name: 'User %', value: `> ${Math.round(allvalues.get('cpuspeed').currentLoadUser * 100)/100}`, inline: true  },
                        {   name: 'System %', value: `> ${Math.round(allvalues.get('cpuspeed').currentLoadSystem * 100)/100}`, inline: true  },
                        {  name: '\u200b', value: `\`\`\`RAM\`\`\``, inline: false, },
                        {   name: 'In Use', value: `> ${Math.round((os.totalmem() - os.freemem())/1048576)} MB / ${Math.round(((os.totalmem() - os.freemem())/1073741824)*100)/100} GB`, inline: true  },
                        {   name: 'Free', value: `> ${Math.round(os.freemem()/1048576)} MB / ${Math.round((os.freemem()/1073741824) * 100)/100} GB`, inline: true  },
                        {   name: 'Total', value: `> ${Math.round(os.totalmem()/1048576)} MB / ${Math.round((os.totalmem()/1073741824)*100)/100} GB`, inline: true  },
                        {  name: '\u200b', value: `\`\`\`SWAP\`\`\``, inline: false, },
                        {   name: 'In Use', value: `> ${Math.round(allvalues.get('mem').swapused/10737418.24)/100} GB`, inline: true  },
                        {   name: 'Free', value: `> ${Math.round(allvalues.get('mem').swapfree/10737418.24)/100} GB`, inline: true  },
                        {   name: 'Total', value: `> ${Math.round(allvalues.get('mem').swaptotal/10737418.24)/100} GB`, inline: true  },                
                        {  name: '\u200b', value: `\`\`\`System\`\`\``, inline: false, },
                        {   name: 'Uptime', value: `> ${Math.round(os.uptime()/864)/100} Day(s) / ${Math.round(os.uptime()/36)/100} Hour(s)`, inline: true  },
                        {   name: 'Refreshed', value: `<t:${Math.floor(Date.now()/1000)}:R>`, inline: true  },
                        ],
                    }
                    ],
                }).catch((error) => { return });
            return
            //            
        })//if message fetch
        .catch(e => {//if not
            if (valuePairs.get('webhookID') == 'Not_Set') return Wsender.send({ embeds: [ { color: Colors.Yellow, description: `\`\`\`Loading Data\`\`\`` } ] })
                        .then(rw => { 
                            valueKeys.update({ value: rw.id }, { where: { key: 'webhookID' } })
                                .then(r => {
                                    valuePairs.set('webhookID',rw.id)
                                    if (r[0] == 1) return console.log(`DB Saved with new data!`)
                                });                
                        }).catch((error) => { return });
            if ( ++trying < (config.maxRetries + 1) ) return console.log(`Retry : ${trying}`)
            console.log(`Creating New Webhook ( ${trying - 1} Retries Failed )`)
            //
            Wsender.send({
                embeds: [
                    {  color: Colors.White , title: `${os.hostname()}` ,
                    description: `Platform :  \`${os.platform()}\`\nRelease :  \`${os.release()}\`\nVersion :  \`${os.version()}\`\nCPU Model :  \`${os.cpus()[0].model}\``,
                    thumbnail: { url: config.thumbnail },
                    fields: [
                        {  name: '\u200b', value: `\`\`\`CPU\`\`\``, inline: false, },
                        {   name: 'Total Usage %', value: `> ${Math.round(allvalues.get('cpuspeed').currentLoad * 100)/100}`, inline: true  },
                        {   name: 'User %', value: `> ${Math.round(allvalues.get('cpuspeed').currentLoadUser * 100)/100}`, inline: true  },
                        {   name: 'System %', value: `> ${Math.round(allvalues.get('cpuspeed').currentLoadSystem * 100)/100}`, inline: true  },
                        {  name: '\u200b', value: `\`\`\`RAM\`\`\``, inline: false, },
                        {   name: 'In Use', value: `> ${Math.round((os.totalmem() - os.freemem())/1048576)} MB / ${Math.round(((os.totalmem() - os.freemem())/1073741824)*100)/100} GB`, inline: true  },
                        {   name: 'Free', value: `> ${Math.round(os.freemem()/1048576)} MB / ${Math.round((os.freemem()/1073741824) * 100)/100} GB`, inline: true  },
                        {   name: 'Total', value: `> ${Math.round(os.totalmem()/1048576)} MB / ${Math.round((os.totalmem()/1073741824)*100)/100} GB`, inline: true  },
                        {  name: '\u200b', value: `\`\`\`SWAP\`\`\``, inline: false, },
                        {   name: 'In Use', value: `> ${Math.round(allvalues.get('mem').swapused/10737418.24)/100} GB`, inline: true  },
                        {   name: 'Free', value: `> ${Math.round(allvalues.get('mem').swapfree/10737418.24)/100} GB`, inline: true  },
                        {   name: 'Total', value: `> ${Math.round(allvalues.get('mem').swaptotal/10737418.24)/100} GB`, inline: true  },                
                        {  name: '\u200b', value: `\`\`\`System\`\`\``, inline: false, },
                        {   name: 'Uptime', value: `> ${Math.round(os.uptime()/864)/100} Day(s) / ${Math.round(os.uptime()/36)/100} Hour(s)`, inline: true  },
                        {   name: 'Refreshed', value: `<t:${Math.floor(Date.now()/1000)}:R>`, inline: true  },
                        ],
                    }
                    ],
                }).then(rw => { 
                    //console.log(rw.id)
                    valueKeys.update({ value: rw.id }, { where: { key: 'webhookID' } })
                        .then(r => {
                            valuePairs.set('webhookID',rw.id)
                            if (r[0] == 1) return console.log(`DB Saved with new data!`)
                        });                
                }).catch((error) => { return });            
            //
        });
}, config.editTimer * 1000 );