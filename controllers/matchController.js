const fs = require("fs");
const demofile = require("demofile");
const User = require('./../models/userModel');
const { isBuffer } = require("util");
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');
var assert = require('assert');
const { S_IFDIR } = require("constants");

exports.readAllMatches = catchAsync(async (req, res, next) => {
    console.log("readAllMatches");
    const match = await req.user.matches;
    if (!match.length) {
        return next(new AppError('No match found', 404));
    }
    const response = [];
    for (let i of match) {
        response.push({
            id: i.id,
            date: i.date,
            map: i.map,
            gameLength: i.gameLength,
            tClanName: i.tClanName,
            tScore: i.tScore,
            ctClanName: i.ctClanName,
            ctScore: i.ctScore,
            winner: i.winner
        })
    }
    res.status(200).json(response);
});

exports.readMatch = catchAsync(async (req, res, next) => {
    console.log("readMatch");
    const currentUser = req.user;
    const replay = await currentUser.matches.find((replay) => replay.id === req.params.id);

    if (!replay) {
        return next(new AppError("No match found with that ID", 404));
    }

    res.status(200).json(replay);
});

exports.deleteMatch = catchAsync(async (req, res, next) => {
    console.log("deleteMatch");
    const currentUser = req.user;
    const replay = await currentUser.matches.find((replay) => replay.id === req.params.id);
    if (!replay) {
        return next(new AppError("No match found with that ID", 404));
    }
    const updReplay = await currentUser.matches.filter((replay) => replay.id !== req.params.id);
    currentUser.matches = updReplay;
    currentUser.save();
    res.status(200).json(currentUser.matches);
});

exports.createMatch = (req, res) => {
    fs.readFile(req.files.file.path, (err, buffer) => {
        assert.ifError(err);
        const hitgroups = {
            1: 'head',
            2: 'chest',
            3: 'stomach',
            4: 'leftarm',
            5: 'rightarm',
            6: 'leftleg',
            7: 'rightleg',
        }
        const reasons = {
            1: 'target_bombed', // t win
            7: 'bomb_defused', // ct win
            8: 'terrorists_killed', // ct win
            9: 'cts_killed', // t win
            12: 'target_saved', // ct win
            17: 'terrorists_surrender', // ct win
            18: 'ct_surrender' // t win
        }
        const teams = {
            0: 'none',
            1: 'spectator',
            2: 'terrorists',
            3: 'cts'
        }
        const demo = new demofile.DemoFile();

        let overview = {
            players: {},
            rounds: {},
            weapons: {},
            accuracy: {},
            performance: {},
            economy: {},
            rating: {
                ct: {},
                t: {}
            }
        }

        function logTeamScores(e) {
            const terrorists = demo.teams[2];
            const cts = demo.teams[3];
            const roundNumber = demo.gameRules.roundNumber;
            console.log(roundNumber);
            if (overview.rounds[roundNumber] === undefined) {
                overview.rounds[roundNumber] = {};
            }

            overview.rounds[roundNumber].ctScore = cts.score;
            overview.rounds[roundNumber].ttScore = terrorists.score;

            for (const p of terrorists.members) {

                if (p.isFakePlayer) continue;

                if (!overview.players[p.name]) {
                    overview.players[p.name] = {
                        name: p.name,
                        clanName: terrorists.clanName,
                        teamGame: 't',
                        kills: p.kills,
                        deaths: p.deaths,
                        assists: p.assists,
                        cashSpendTotal: p.cashSpendTotal,
                    }
                } else {
                    overview.players[p.name] = {
                        name: p.name,
                        clanName: terrorists.clanName,
                        teamGame: 't',
                        kills: p.kills,
                        deaths: p.deaths,
                        assists: p.assists,
                        cashSpendTotal: p.cashSpendTotal,
                    }
                }
                const mStats = p.matchStats;
                const roundResetNumber = roundNumber <= 30 ? roundNumber : roundNumber % 30;
                const roundIndex = roundResetNumber - 1;
                const matchStats = mStats[roundIndex];

                if (overview.rounds[roundNumber] === undefined) {
                    overview.rounds[roundNumber] = {};
                }
                overview.rounds[roundNumber][p.name] = {
                    assists: matchStats.assists,
                    damage: matchStats.damage,
                    equipmentValue: matchStats.equipmentValue,
                    headshotKills: matchStats.headShotKills,
                    killReward: matchStats.killReward,
                    kills: matchStats.kills,
                    timeAlive: matchStats.liveTime,
                    moneySaved: matchStats.moneySaved,
                    objectives: matchStats.objective,
                    clanName: overview.players[p.name].clanName
                }

                overview.rounds[roundNumber][p.name].total = p.cashSpendTotal;
                if (roundNumber === 1) {
                    overview.rounds[roundNumber][p.name].amountSpent = p.cashSpendTotal;
                } else {
                    overview.rounds[roundNumber][p.name].amountSpent = (p.cashSpendTotal - overview.rounds[roundNumber - 1][p.name].total);
                }
            }
            for (const p of cts.members) {

                if (p.isFakePlayer) continue;

                if (!overview.players[p.name]) {
                    overview.players[p.name] = {
                        name: p.name,
                        clanName: cts.clanName,
                        teamGame: 'ct',
                        kills: p.kills,
                        deaths: p.deaths,
                        assists: p.assists,
                        cashSpendTotal: p.cashSpendTotal,
                    }
                } else {
                    overview.players[p.name] = {
                        name: p.name,
                        clanName: cts.clanName,
                        teamGame: 'ct',
                        kills: p.kills,
                        deaths: p.deaths,
                        assists: p.assists,
                        cashSpendTotal: p.cashSpendTotal,
                    }
                }

                const mStats = p.matchStats;
                const roundResetNumber = roundNumber <= 30 ? roundNumber : roundNumber % 30;
                const roundIndex = roundResetNumber - 1;
                const matchStats = mStats[roundIndex];
                if (overview.rounds[roundNumber] === undefined) {
                    overview.rounds[roundNumber] = {}
                }
                overview.rounds[roundNumber][p.name] = {
                    amountSpent: p.cashSpendThisRound,
                    hasHelmet: p.hasHelmet,
                    assists: matchStats.assists,
                    damage: matchStats.damage,
                    equipmentValue: matchStats.equipmentValue,
                    headshotKills: matchStats.headShotKills,
                    killReward: matchStats.killReward,
                    kills: matchStats.kills,
                    timeAlive: matchStats.liveTime,
                    moneySaved: matchStats.moneySaved,
                    objectives: matchStats.objective,
                    clanName: overview.players[p.name].clanName
                }

                overview.rounds[roundNumber][p.name].total = p.cashSpendTotal;
                if (roundNumber === 1) {
                    overview.rounds[roundNumber][p.name].amountSpent = p.cashSpendTotal;
                } else {
                    overview.rounds[roundNumber][p.name].amountSpent = (p.cashSpendTotal - overview.rounds[roundNumber - 1][p.name].total);
                }
            };
        }

        demo.on('start', () => {
            overview.map = demo.header.mapName;
        });

        demo.gameEvents.on('player_death', (e) => {
            const attacker = demo.entities.getByUserId(e.attacker);
            const attackerName = attacker ? attacker.name : "unnamed";

            if (overview.weapons[attackerName] === undefined) overview.weapons[attackerName] = {};

            if (e.weapon === 'hkp2000') {
                e.weapon = 'usp_silencer';
            }
            if (e.weapon === 'inferno') {
                e.weapon = 'molotov';
            }
            if (e.weapon === 'm4a1') {
                e.weapon = 'm4a4';
            }
            if (!overview.weapons[attackerName][e.weapon]) {
                overview.weapons[attackerName][e.weapon] = {
                    kills: 1,
                    headshots: 0,
                    damage: 0,
                    numberFired: 0,
                    numberHit: 0,
                    accuracy: 0
                }
                if (e.headshot) {
                    overview.weapons[attackerName][e.weapon].headshots = 1;
                }
            } else {
                let prevKills = overview.weapons[attackerName][e.weapon].kills;
                overview.weapons[attackerName][e.weapon].kills = prevKills + 1;
                if (e.headshot) {
                    let prevHeadshots = overview.weapons[attackerName][e.weapon].headshots;
                    overview.weapons[attackerName][e.weapon].headshots = prevHeadshots + 1;
                }
            }
        });
        demo.gameEvents.on('player_hurt', (e) => {
            const attacker = demo.entities.getByUserId(e.attacker);
            const attackerName = attacker ? attacker.name : "unnamed";


            if (overview.accuracy[attackerName] === undefined) overview.accuracy[attackerName] = {};
            if (e.weapon === 'hkp2000') {
                e.weapon = 'usp_silencer';
            }
            if (e.weapon === 'inferno') {
                e.weapon = 'molotov';
            }
            if (e.weapon === 'm4a1') {
                e.weapon = 'm4a4';
            }
            if (!overview.accuracy[attackerName][e.weapon]) {
                overview.accuracy[attackerName][e.weapon] = {
                    head: 0,
                    chest: 0,
                    stomach: 0,
                    leftarm: 0,
                    rightarm: 0,
                    leftleg: 0,
                    rightleg: 0
                };
                overview.accuracy[attackerName][e.weapon][hitgroups[e.hitgroup]] = 1
            } else {
                let prev = overview.accuracy[attackerName][e.weapon][hitgroups[e.hitgroup]];
                overview.accuracy[attackerName][e.weapon][hitgroups[e.hitgroup]] = prev + 1;
            }

            if (overview.performance[attackerName] === undefined) overview.performance[attackerName] = {};
            if (e.hitgroup == 1) {
                if (!(overview.performance[attackerName].headshotHits)) {
                    overview.performance[attackerName].headshotHits = 1;
                } else {
                    const prevVal = overview.performance[attackerName].headshotHits;
                    overview.performance[attackerName].headshotHits = prevVal + 1;
                }
            }

            if (!(overview.performance[attackerName].totalHits)) {
                overview.performance[attackerName].totalHits = 1;
            } else {
                const prevVal = overview.performance[attackerName].totalHits;
                overview.performance[attackerName].totalHits = prevVal + 1;
            }
            if (overview.weapons[attackerName] === undefined) overview.weapons[attackerName] = {};
            if (!overview.weapons[attackerName][e.weapon]) {
                overview.weapons[attackerName][e.weapon] = {
                    kills: 0,
                    headshots: 0,
                    damage: e['dmg_health'],
                    numberFired: 0,
                    numberHit: 1,
                    accuracy: 0
                }
            } else {
                let prevDamage = overview.weapons[attackerName][e.weapon].damage;
                overview.weapons[attackerName][e.weapon].damage = prevDamage + e['dmg_health'];

                let prevHits = overview.weapons[attackerName][e.weapon].numberHit;
                overview.weapons[attackerName][e.weapon].numberHit = prevHits + 1;

                let numberFired = overview.weapons[attackerName][e.weapon].numberFired;
                let numberHit = overview.weapons[attackerName][e.weapon].numberHit;
                overview.weapons[attackerName][e.weapon].accuracy = (numberHit / numberFired) * 100;
            }
        });
        demo.gameEvents.on('weapon_fire', (e) => {
            const attacker = demo.entities.getByUserId(e.userid);
            const attackerName = attacker ? attacker.name : "unnamed";
            e.weapon = e.weapon.slice(7, e.weapon.length);
            if (e.weapon === 'hkp2000') {
                e.weapon = 'usp_silencer';
            }
            if (e.weapon === 'inferno') {
                e.weapon = 'molotov';
            }
            if (e.weapon === 'm4a1') {
                e.weapon = 'm4a4';
            }
            if (overview.performance[attackerName] === undefined) overview.performance[attackerName] = {};
            if (!overview.performance[attackerName].totalFired) {
                overview.performance[attackerName].totalFired = 1;
            } else {
                const prevVal = overview.performance[attackerName].totalFired;
                overview.performance[attackerName].totalFired = prevVal + 1;
            }
            if (overview.weapons[attackerName] === undefined) overview.weapons[attackerName] = {};
            if (!overview.weapons[attackerName][e.weapon]) {
                overview.weapons[attackerName][e.weapon] = {
                    kills: 0,
                    headshots: 0,
                    damage: 0,
                    numberFired: 1,
                    numberHit: 0,
                    accuracy: 0
                }
            } else {
                let prevFired = overview.weapons[attackerName][e.weapon].numberFired;
                overview.weapons[attackerName][e.weapon].numberFired = prevFired + 1;

                let numberFired = overview.weapons[attackerName][e.weapon].numberFired;
                let numberHit = overview.weapons[attackerName][e.weapon].numberHit;
                overview.weapons[attackerName][e.weapon].accuracy = (numberHit / numberFired) * 100;
            }

        });
        demo.gameEvents.on('round_end', (e) => {
            let roundNumber = demo.gameRules.roundsPlayed;
            if (overview.rounds[roundNumber] === undefined) {
                overview.rounds[roundNumber] = {};
            }
            overview.rounds[roundNumber].reason = reasons[e.reason];
        });
        demo.gameEvents.on('round_officially_ended', (e) => {
            logTeamScores();
        });
        demo.on('end', (e) => {
            if (e.error) {
                console.error("Error during parsing:", e.error);
            }
            else {
                logTeamScores();

                const navigator = (obj, path) => path.reduce((a, b) => a && a[b], obj);
                let seconds = demo.currentTime;
                const secondsToMinutes = Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
                overview.gameLength = secondsToMinutes;

                let teamT = demo.teams[2];
                overview.tClanName = teamT.clanName;
                overview.tScore = teamT.score;
                let teamCT = demo.teams[3];
                overview.ctClanName = teamCT.clanName;
                overview.ctScore = teamCT.score;
                const numRounds = overview.tScore + overview.ctScore;

                for (const p of teamT.members) {
                    let totalDamages = 0;
                    let deaths = 0;
                    let kills1 = 0;
                    let kills2 = 0;
                    let kills3 = 0;
                    let kills4 = 0;
                    let kills5 = 0;
                    let killRating = 0;
                    let survivalRating = 0;
                    let roundsWithMultiple = 0;
                    for (let i = 1; i <= numRounds; i++) {
                        let param = navigator(overview, ['rounds', i, p.name, 'damage']);
                        if (param === undefined) continue;
                        totalDamages += param;
                        if (overview.rounds[i][p.name].liveTime === 0) deaths += 1;
                        if (overview.rounds[i][p.name].kills === 1) kills1 += 1;
                        else if (overview.rounds[i][p.name].kills === 2) kills2 += 1;
                        else if (overview.rounds[i][p.name].kills === 3) kills3 += 1;
                        else if (overview.rounds[i][p.name].kills === 4) kills4 += 1;
                        else if (overview.rounds[i][p.name].kills === 5) kills5 += 1;

                        killRating = overview.rounds[i][p.name].kills / i;
                        survivalRating = (i - deaths) / i;
                        roundsWithMultiple = (kills1 + 4 * kills2 + 9 * kills3 + 16 * kills4 + 25 * kills5) / i;

                        rating = (killRating + 0.70 * survivalRating + roundsWithMultiple + 0.30 * (totalDamages / i)) * 100;

                        overview.rounds[i][p.name].totalDamages = totalDamages;
                        overview.rounds[i][p.name].team = "t";
                        overview.rounds[i][p.name].kills1 = kills1;
                        overview.rounds[i][p.name].kills2 = kills2;
                        overview.rounds[i][p.name].kills3 = kills3;
                        overview.rounds[i][p.name].kills4 = kills4;
                        overview.rounds[i][p.name].kills5 = kills5;
                        overview.rounds[i][p.name].rating = rating;
                        if (overview.rating.t[p.name] === undefined) overview.rating.t[p.name] = {};
                        if (overview.rating.t[p.name][i] === undefined) overview.rating.t[p.name][i] = {};
                        overview.rating.t[p.name][i].rating = rating;
                        overview.rating.t[p.name][i].totalDamages = totalDamages;
                    }

                    overview.players[p.name].totalDamages = totalDamages;
                    overview.players[p.name].averageDamages = totalDamages / numRounds;
                    overview.players[p.name].averageKills = overview.players[p.name].kills / numRounds;
                    overview.players[p.name].averageHeadshot = overview.performance[p.name].headshotHits / overview.players[p.name].kills;
                    overview.players[p.name].averageAssists = overview.players[p.name].assists / numRounds;
                    overview.players[p.name].averageDeaths = overview.players[p.name].deaths / numRounds;
                    overview.players[p.name].overallAccuracy = (overview.performance[p.name].totalHits / overview.performance[p.name].totalFired) * 100;
                    overview.weapons[p.name].name = overview.players[p.name].name;
                    overview.weapons[p.name].teamGame = overview.players[p.name].teamGame;
                    overview.weapons[p.name].kills = overview.players[p.name].kills;
                    overview.weapons[p.name].clanName = overview.players[p.name].clanName;
                }

                for (const p of teamCT.members) {
                    let totalDamages = 0;
                    let deaths = 0;
                    let kills1 = 0;
                    let kills2 = 0;
                    let kills3 = 0;
                    let kills4 = 0;
                    let kills5 = 0;
                    let killRating = 0;
                    let survivalRating = 0;
                    let roundsWithMultiple = 0;
                    for (let i = 1; i <= numRounds; i++) {
                        let param = navigator(overview, ['rounds', i, p.name, 'damage']);
                        if (param === undefined) continue;
                        totalDamages += param;
                        if (overview.rounds[i][p.name].liveTime === 0) deaths += 1;
                        if (overview.rounds[i][p.name].kills === 1) kills1 += 1;
                        else if (overview.rounds[i][p.name].kills === 2) kills2 += 1;
                        else if (overview.rounds[i][p.name].kills === 3) kills3 += 1;
                        else if (overview.rounds[i][p.name].kills === 4) kills4 += 1;
                        else if (overview.rounds[i][p.name].kills === 5) kills5 += 1;

                        killRating = overview.rounds[i][p.name].kills / i;
                        survivalRating = (i - deaths) / i;
                        roundsWithMultiple = (kills1 + 4 * kills2 + 9 * kills3 + 16 * kills4 + 25 * kills5) / i;

                        rating = (killRating + 0.70 * survivalRating + roundsWithMultiple + 0.30 * (totalDamages / i)) * 100;

                        overview.rounds[i][p.name].totalDamages = totalDamages;
                        overview.rounds[i][p.name].team = "ct";
                        overview.rounds[i][p.name].kills1 = kills1;
                        overview.rounds[i][p.name].kills2 = kills2;
                        overview.rounds[i][p.name].kills3 = kills3;
                        overview.rounds[i][p.name].kills4 = kills4;
                        overview.rounds[i][p.name].kills5 = kills5;
                        overview.rounds[i][p.name].rating = rating;
                        if (overview.rating.ct[p.name] === undefined) overview.rating.ct[p.name] = {};
                        if (overview.rating.ct[p.name][i] === undefined) overview.rating.ct[p.name][i] = {};
                        overview.rating.ct[p.name][i].rating = rating;
                        overview.rating.ct[p.name][i].totalDamages = totalDamages;
                    }

                    overview.players[p.name].totalDamages = totalDamages;
                    overview.players[p.name].averageDamages = totalDamages / numRounds;
                    overview.players[p.name].averageKills = overview.players[p.name].kills / numRounds;
                    overview.players[p.name].averageHeadshot = overview.performance[p.name].headshotHits / overview.players[p.name].kills;
                    overview.players[p.name].averageAssists = overview.players[p.name].assists / numRounds;
                    overview.players[p.name].averageDeaths = overview.players[p.name].deaths / numRounds;
                    overview.players[p.name].overallAccuracy = (overview.performance[p.name].totalHits / overview.performance[p.name].totalFired) * 100;
                    overview.weapons[p.name].name = overview.players[p.name].name;
                    overview.weapons[p.name].teamGame = overview.players[p.name].teamGame;
                    overview.weapons[p.name].kills = overview.players[p.name].kills;
                    overview.weapons[p.name].clanName = overview.players[p.name].clanName;
                }

                for (let i = 1; i <= numRounds; i++) {
                    let amountSpentCT = 0;
                    let moneySavedCT = 0;
                    let equipmentValueCT = 0;

                    if (overview.economy[i] === undefined) overview.economy[i] = {};

                    for (const p of teamCT.members) {
                        let amountSpent = 0;
                        let moneySaved = 0;
                        let equipmentValue = 0;
                        amountSpent = overview.rounds[i][p.name].amountSpent;
                        amountSpentCT += amountSpent;
                        moneySaved = overview.rounds[i][p.name].moneySaved;
                        moneySavedCT += moneySaved;
                        equipmentValue = overview.rounds[i][p.name].equipmentValue;
                        equipmentValueCT += equipmentValue;
                    }
                    overview.economy[i].budgetCT = amountSpentCT + moneySavedCT + equipmentValueCT;
                    overview.economy[i].amountSpentCT = amountSpentCT;
                    overview.economy[i].moneySavedCT = moneySavedCT;
                    overview.economy[i].equipmentValueCT = equipmentValueCT;

                    let amountSpentT = 0;
                    let moneySavedT = 0;
                    let equipmentValueT = 0;
                    for (const p of teamT.members) {
                        let amountSpent = 0;
                        let moneySaved = 0;
                        let equipmentValue = 0;
                        amountSpent = overview.rounds[i][p.name].amountSpent;
                        amountSpentT += amountSpent;
                        moneySaved = overview.rounds[i][p.name].moneySaved;
                        moneySavedT += moneySaved;
                        equipmentValue = overview.rounds[i][p.name].equipmentValue;
                        equipmentValueT += equipmentValue;
                    }
                    overview.economy[i].budgetT = amountSpentT + moneySavedT + equipmentValueT;
                    overview.economy[i].amountSpentT = amountSpentT;
                    overview.economy[i].moneySavedT = moneySavedT;
                    overview.economy[i].equipmentValueT = equipmentValueT;
                }

                overview.date = Date.now();
                overview.id = uuidv4();
                //save to db
                const currentUser = req.user;
                console.log('save to db');
                if (!currentUser) {
                    return next(new AppError("User not exist", 404));
                }
                currentUser.matches.push(overview);
                currentUser.save();
                res.status(200).json({
                    status: 'success'
                });
                console.log('yes, we saved it');
            }
        });
        demo.parse(buffer);


    });
};
