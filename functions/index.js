const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.updateGame = functions.firestore
    .document('GameRoom/{GameId}')
    .onUpdate(async(change, context) => {
        //new values
        const newValue = change.after.data();
        //previous values
        const previousValue = change.before.data();
        const confvalue1 = newValue.valueselected;
        var val1;
        var val2;
        var turn = newValue.turn;
        var uid1move;
        var uid2move;
        var uid1nset = 0;
        var uid2nset = 0;
        var uid1nturn = 0;
        var uid2nturn = 0;

        switch (confvalue1) {
            case "uid1value1":
                val1 = parseFloat(newValue.uid1value1);
                val2 = parseFloat(newValue.uid2value1);
                confvalue2 = "uid2value1";
                break;
            case "uid1value2":
                val1 = parseFloat(newValue.uid1value2);
                val2 = parseFloat(newValue.uid2value2);
                confvalue2 = "uid2value2";
                break;
            case "uid1value3":
                val1 = parseFloat(newValue.uid1value3);
                val2 = parseFloat(newValue.uid2value3);
                confvalue2 = "uid2value3";
                break;
            case "uid1value4":
                val1 = parseFloat(newValue.uid1value4);
                val2 = parseFloat(newValue.uid2value4);
                confvalue2 = "uid2value4";
                break;
            case "uid1value5":
                val1 = parseFloat(newValue.uid1value5);
                val2 = parseFloat(newValue.uid2value5);
                confvalue2 = "uid2value5";
                break;
            case "uid2value1":
                val1 = parseFloat(newValue.uid2value1);
                val2 = parseFloat(newValue.uid1value1);
                confvalue2 = "uid1value1";
                break;
            case "uid2value2":
                val1 = parseFloat(newValue.uid2value2);
                val2 = parseFloat(newValue.uid1value2);
                confvalue2 = "uid1value2";
                break;
            case "uid2value3":
                val1 = parseFloat(newValue.uid2value3);
                val2 = parseFloat(newValue.uid1value3);
                confvalue2 = "uid1value3";
                break;
            case "uid2value4":
                val1 = parseFloat(newValue.uid2value4);
                val2 = parseFloat(newValue.uid1value4);
                confvalue2 = "uid1value4";
                break;
            case "uid2value5":
                val1 = parseFloat(newValue.uid2value5);
                val2 = parseFloat(newValue.uid1value5);
                confvalue2 = "uid1value5";
                break;
            default:
                break;
        }

        var operation = newValue.operation;
        // username has been changed
        const snapshot = await admin.firestore()
            .collection("GameRoom")
            .where('uid1', '==', newValue.uid1)
            .where('uid2', '==', newValue.uid2)
            .where('deck', '==', newValue.deck)
            .where('status', '==', newValue.status)
            .get();


        if ((operation.localeCompare("greater")) === 0) {
            console.log("greater")
            if (newValue.turn.localeCompare("uid1") === 0) {
                console.log("uid1")
                if (val1 > val2) {
                    if (parseFloat(newValue.uid2decksize) === 1 && parseFloat(newValue.uid1nset) === 2) {
                        //Vittoria game
                        console.log("Vittoria game")
                        uid1move = "gamewin";
                        uid2move = "gamelost"
                    } else if (parseFloat(newValue.uid2decksize) === 1 && parseFloat(newValue.uid1nset) < 2) {
                        //Vittoria set
                        console.log("Vittoria set")

                        uid1nset = newValue.uid1nset + 1
                        uid1move = "setwin";
                        uid2move = "setlost";
                        turn = "uid2"

                    } else if (parseFloat(newValue.uid2decksize) > 1 && parseFloat(newValue.uid1nturn) < 2) {
                        //Vittoria turno
                        console.log("Vittoria turno")
                        uid1nturn = newValue.uid1nturn + 1
                        uid1move = "turnwin";
                        uid2move = "turnlost";
                        turn = "uid1"
                    } else {
                        console.log("Vittoria turno con switch")
                        uid1nturn = 0
                        uid2nturn = 0
                        uid1move = "turnwinswitch";
                        uid2move = "turnlostswitch";
                        turn = "uid2"

                    }

                    return change.after.ref.set({
                        uid1move: uid1move,
                        uid2move: uid2move,
                        operation: '',
                        turn: turn,
                        uid1nturn: uid1nturn,
                        uid2nturn: uid2nturn,
                        uid1nset: uid1nset,
                        uid2nset: uid2nset,
                        valueselected: ' ',
                    }, { merge: true });
                }
                if (val1 < val2) {
                    let updatePromises = [];
                    snapshot.forEach(doc => {
                        updatePromises.push(
                            admin.firestore()
                            .collection('GameRoom')
                            .doc(doc.id).update({ uid1move: "turnlost" })
                            .update({ uid1nturn: "0" }));
                    });

                    await Promise.all(updatePromises);
                }
            } else if (newValue.turn.localeCompare("uid2") === 0) {
                if (val1 > val2) {
                    if (parseFloat(newValue.uid1decksize) === 1 && parseFloat(newValue.uid2nset) === 2) {
                        //Vittoria game
                        uid2move = "gamewin";
                        uid1move = "gamelost"
                    } else if (parseFloat(newValue.uid1decksize) === 1 && parseFloat(newValue.uid2nset) < 2) {
                        //Vittoria set
                        uid2nset = uid2nset++
                            uid2move = "setwin";
                        uid1move = "setlost";
                    } else if (parseFloat(newValue.uid1decksize) > 1 && parseFloat(newValue.uid2nturn) < 2) {
                        //Vittoria turno
                        uid2nturn = uid2nturn++
                            uid2move = "turnwin";
                        uid1move = "turnlost";
                    } else {
                        uid2nturn = 0
                        uid2move = "turnwinswitch";
                        uid1move = "turnlostswitch";
                    }


                    let updatePromises = [];
                    snapshot.forEach(doc => {
                        updatePromises.push(
                            admin.firestore()
                            .collection('GameRoom')
                            .doc(doc.id).update({ uid1move: move })
                            .update({ uid1nturn: uid1nturn })
                        );
                    });

                    await Promise.all(updatePromises);

                }
                if (val1 < val2) {
                    let updatePromises = [];
                    snapshot.forEach(doc => {
                        updatePromises.push(
                            admin.firestore()
                            .collection('GameRoom')
                            .doc(doc.id).update({ uid2move: 'turnlost' })
                            .update({ uid2nturn: '0' }));
                    });

                    await Promise.all(updatePromises);
                }

            } else {
                return 0;
            }
        }
        if ((operation.localeCompare("lower")) === 0) {
            if (val1 < val2) {
                console.log("lower")
                const snapshot = await admin.firestore()
                    .collection("GameRoom")
                    .where('uid1', '==', newValue.uid1)
                    .where('uid2', '==', newValue.uid2)
                    .where('deck', '==', newValue.deck)
                    .where('status', '==', newValue.status)
                    .get();
                let updatePromises = [];
                snapshot.forEach(doc => {
                    updatePromises.push(
                        admin.firestore()
                        .collection('GameRoom')
                        .doc(doc.id).update({ uid1move: 'turnwin' }));
                });

                await Promise.all(updatePromises);


            }
            if (val1 > val2) {
                let updatePromises = [];
                snapshot.forEach(doc => {
                    updatePromises.push(
                        admin.firestore()
                        .collection('GameRoom')
                        .doc(doc.id).update({ uid1move: 'turnlost' }));
                });

                await Promise.all(updatePromises);
            }
        }
        return 0;
    });


exports.setTurn = functions.firestore
    .document('GameRoom/{GameId}')
    .onCreate(async(change, context) => {
        console.log("onCreate");
        var rnds = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        if (rnds === 1) {
            return change.ref.set({
                turn: "uid1"
            }, { merge: true });

        } else if (rnds === 2) {
            return change.ref.set({
                turn: "uid2"
            }, { merge: true });

        } else {
            return false;
        }

    });