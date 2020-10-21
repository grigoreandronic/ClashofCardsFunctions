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
        var uid1nset = parseFloat(newValue.uid1nset);
        var uid2nset = parseFloat(newValue.uid2nset);
        var uid1nturn = parseFloat(newValue.uid1nturn);
        var uid2nturn = parseFloat(newValue.uid2nturn);
        var uid1decksize = parseFloat(newValue.uid1decksize);
        var uid2decksize = parseFloat(newValue.uid2decksize);
        var valueselected = newValue.valueselected;
        var operation = newValue.operation;

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

        if ((operation.localeCompare("greater")) === 0) {
            console.log("greater")
            if (newValue.turn.localeCompare("uid1") === 0) {
                console.log("uid1")
                if (val1 >= val2) {
                    if (uid2decksize === 1 && uid1nset === 2) {
                        //Vittoria game
                        console.log("Vittoria game")
                        uid1move = "gamewin";
                        uid2move = "gamelost"
                    } else if (uid2decksize === 1 && uid1nset < 2) {
                        //Vittoria set
                        console.log("Vittoria set")
                        uid1nset++;
                        uid1decksize = decksize
                        uid2decksize = decksize
                        uid1nturn = 0
                        uid1move = "setwin";
                        uid2move = "setlost";
                        turn = "uid2"
                    } else if (uid2decksize > 1 && uid1nturn < 2) {
                        //Vittoria turno
                        console.log("Vittoria turno")
                        uid1nturn++;
                        uid1move = "turnwin";
                        uid2move = "turnlost";
                        uid2decksize--;
                        turn = "uid1";
                    } else {
                        console.log("Vittoria turno con switch")
                        uid1nturn = 0;
                        uid2nturn = 0;
                        uid1move = "turnwinswitch";
                        uid2move = "turnlostswitch";
                        uid2decksize--;
                        turn = "uid2";

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
                    if (uid1decksize === 1 && newValue.uid2nset === 2) {
                        // game perso
                        console.log("Vittoria game avversario")
                        uid1move = "gamelost";
                        uid2move = "gamewin"
                    } else if (uid1decksize === 1 && uid2nset < 2) {
                        //set perso
                        console.log("Vittoria set avversario")
                        uid1nturn = 0
                        uid2nturn = 0
                        uid2nset = (uid2nset) + 1
                        uid2move = "setwin";
                        uid1move = "setlost";
                        turn = "uid1"

                    } else {
                        // turno perso
                        console.log("Vittoria turno avversario")
                        uid2nturn = (uid2nturn) + 1
                        uid2move = "turnwin";
                        uid1move = "turnlost";
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
            } else if (newValue.turn.localeCompare("uid2") === 0) {
                console.log("uid2")
                if (val1 >= val2) {
                    if (uid1decksize === 1 && uid2nset === 2) {
                        //Vittoria game
                        console.log("Vittoria game")
                        uid2move = "gamewin";
                        uid1move = "gamelost"
                    } else if (uid1decksize === 1 && uid2nset < 2) {
                        //Vittoria set
                        console.log("Vittoria set")
                        uid2nset++;
                        uid2decksize = decksize
                        uid1decksize = decksize
                        uid2nturn = 0
                        uid2move = "setwin";
                        uid1move = "setlost";
                        turn = "uid1"
                    } else if (uid1decksize > 1 && uid2nturn < 2) {
                        //Vittoria turno
                        console.log("Vittoria turno")
                        uid2nturn++;
                        uid2move = "turnwin";
                        uid1move = "turnlost";
                        uid1decksize--;
                        turn = "uid2";
                    } else {
                        console.log("Vittoria turno con switch")
                        uid1nturn = 0;
                        uid2nturn = 0;
                        uid2move = "turnwinswitch";
                        uid1move = "turnlostswitch";
                        uid1decksize--;
                        turn = "uid1";

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
                    if (uid2decksize === 1 && newValue.uid1nset === 2) {
                        // game perso
                        console.log("Vittoria game avversario")
                        uid2move = "gamelost";
                        uid1move = "gamewin"
                    } else if (uid1decksize === 1 && uid2nset < 2) {
                        //set perso
                        console.log("Vittoria set avversario")
                        uid2nturn = 0
                        uid1nturn = 0
                        uid1nset = (uid2nset) + 1
                        uid1move = "setwin";
                        uid2move = "setlost";
                        turn = "uid2"

                    } else {
                        // turno perso
                        console.log("Vittoria turno avversario")
                        uid1nturn = (uid1nturn) + 1
                        uid1move = "turnwin";
                        uid2move = "turnlost";
                        turn = "uid1"
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
            }
        }
        if ((operation.localeCompare("lower")) === 0) {
            console.log("lower")
            if (newValue.turn.localeCompare("uid1") === 0) {
                console.log("uid1")
                if (val1 <= val2) {
                    if ((uid2decksize) === 1 && (uid1nset) === 2) {
                        //Vittoria game
                        console.log("Vittoria game")
                        uid1move = "gamewin";
                        uid2move = "gamelost"
                    } else if ((uid2decksize) === 1 && (uid1nset) < 2) {
                        //Vittoria set
                        console.log("Vittoria set")

                        uid1nset = (uid1nset) + 1
                        uid1move = "setwin";
                        uid2move = "setlost";
                        turn = "uid2"

                    } else if ((uid2decksize) > 1 && (uid1nturn) < 2) {
                        //Vittoria turno
                        console.log("Vittoria turno")
                        uid1nturn = (uid1nturn) + 1
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
                if (val1 > val2) {
                    if ((uid1decksize) === 1 && (uid2nset) === 2) {
                        // game perso
                        console.log("Vittoria game avversario")
                        uid1move = "gamelost";
                        uid2move = "gamewin"
                    } else if ((uid1decksize) === 1 && (uid2nset) < 2) {
                        //set perso
                        console.log("Vittoria set avversario")

                        uid2nset = (uid2nset) + 1
                        uid2move = "setwin";
                        uid1move = "setlost";
                        turn = "uid2"

                    } else {
                        // turno perso
                        console.log("Vittoria turno avversario")
                        uid2nturn = (uid2nturn) + 1
                        uid2move = "turnwin";
                        uid1move = "turnlost";
                        turn = "uid1"
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
            } else if (newValue.turn.localeCompare("uid2") === 0) {
                console.log("uid1")
                if (val1 <= val2) {
                    if ((uid1decksize) === 1 && (uid2nset) === 2) {
                        //Vittoria game
                        console.log("Vittoria game")
                        uid2move = "gamewin";
                        uid1move = "gamelost"
                    } else if ((uid1decksize) === 1 && (uid2nset) < 2) {
                        //Vittoria set
                        console.log("Vittoria set")

                        uid2nset = (uid1nset) + 1
                        uid2move = "setwin";
                        uid1move = "setlost";
                        turn = "uid1"

                    } else if ((uid1decksize) > 1 && (uid2nturn) < 2) {
                        //Vittoria turno
                        console.log("Vittoria turno")
                        uid2nturn = (uid1nturn) + 1
                        uid2move = "turnwin";
                        uid1move = "turnlost";
                        turn = "uid2"
                    } else {
                        console.log("Vittoria turno con switch")
                        uid2nturn = 0
                        uid1nturn = 0
                        uid2move = "turnwinswitch";
                        uid1move = "turnlostswitch";
                        turn = "uid1"

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
                if (val1 > val2) {
                    if ((uid2decksize) === 1 && (uid1nset) === 2) {
                        // game perso
                        console.log("Vittoria game avversario")
                        uid2move = "gamelost";
                        uid1move = "gamewin"
                    } else if ((uid2decksize) === 1 && (uid1nset) < 2) {
                        //set perso
                        console.log("Vittoria set avversario")

                        uid1nset = (uid1nset) + 1
                        uid1move = "setwin";
                        uid2move = "setlost";
                        turn = "uid1"

                    } else {
                        // turno perso
                        console.log("Vittoria turno avversario")
                        uid1nturn = (uid1nturn) + 1
                        uid1move = "turnwin";
                        uid2move = "turnlost";
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