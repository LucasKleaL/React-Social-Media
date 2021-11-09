import { React, useEffect, useRef, useState } from "react";
import Firebase from "./../Firebase";

function Paypal(props) {

    const paypal = useRef();
    const [authUserUid, setAuthUserUid] = useState();

    useEffect(() => {

        if (props.checkout == "blue") {

            window.paypal
            .Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: "SetUp Blue Recharge de 1000 Up Coins",
                                amount: {
                                    currency_code: "BRL",
                                    value: 5.00,
                                },
                            },
                        ],
                    });
                },
                onApprove: async(data, actions) => {
                    const order = await actions.order.capture();
                    console.log(order)

                    await Firebase.firestore().collection("usuario").doc(authUserUid).get()
                    .then((snapshot) => {
                        let saldo = snapshot.data().saldo;
                        saldo = saldo + 1000;
                        Firebase.firestore().collection("usuario").doc(authUserUid).update({
                            saldo: saldo
                        })
                    })
                },
                onError: (err) => {
                    alert("Houve um erro ao processar seu pagamento. Por favor aguarde um momento e tente novamente.")
                },
            })
            .render(paypal.current)

        }
        else if (props.checkout == "purple") {

            window.paypal
            .Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: "SetUp Purple Recharge de 6000 Up Coins",
                                amount: {
                                    currency_code: "BRL",
                                    value: 20.00,
                                },
                            },
                        ],
                    });
                },
                onApprove: async(data, actions) => {
                    const order = await actions.order.capture();
                    console.log(order)

                    await Firebase.firestore().collection("usuario").doc(authUserUid).get()
                    .then((snapshot) => {
                        let saldo = snapshot.data().saldo;
                        saldo = saldo + 6000;
                        Firebase.firestore().collection("usuario").doc(authUserUid).update({
                            saldo: saldo
                        })
                    })
                },
                onError: (err) => {
                    alert("Houve um erro ao processar seu pagamento. Por favor aguarde um momento e tente novamente.")
                },
            })
            .render(paypal.current)

        }

        else if (props.checkout == "green") {
            window.paypal
            .Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: "SetUp Green Recharge de 15000 Up Coins",
                                amount: {
                                    currency_code: "BRL",
                                    value: 50.00,
                                },
                            },
                        ],
                    });
                },
                onApprove: async(data, actions) => {
                    const order = await actions.order.capture();
                    console.log(order)
                    console.log("onApprove")

                    await Firebase.firestore().collection("usuario").doc(authUserUid).get()
                    .then((snapshot) => {
                        let saldo = snapshot.data().saldo;
                        saldo = saldo + 15000;
                        Firebase.firestore().collection("usuario").doc(authUserUid).update({
                            saldo: saldo
                        })
                    })
                },
                onError: (err) => {
                    console.log("error: "+err)
                    alert("Houve um erro ao processar seu pagamento. Por favor aguarde um momento e tente novamente.")
                },
            })
            .render(paypal.current)
        }
        
    }, []);

    async function getAuth() {
        Firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                setAuthUserUid(user.uid);
            }
            else {
                //
            }
        });
    }

    return (
        <div>
            <div ref={paypal} style={{"marginTop": "0.8rem"}}/>
        </div>
    )

}

export default Paypal;