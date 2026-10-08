/* FSHM checkout settings. Paste your own links here; nothing else needs editing.
   In each link, {ref}, {amount} and {email} are filled in automatically.
   Leave a link empty ("") until you have created it in that provider's dashboard. */
window.FSHM_CONFIG={
  plans:{
    complete:{name:"FSHM Complete",price:1200,code:"CMP"},
    accelerator:{name:"FSHM Accelerator",price:600,code:"ACC"},
    launch:{name:"FSHM Launch",price:300,code:"LCH"}
  },
  payLinks:{
    flutterwave:{complete:"https://sandbox.flutterwave.com/pay/txefpatgk60l",accelerator:"https://sandbox.flutterwave.com/pay/wzqsahqvdwab",launch:"https://sandbox.flutterwave.com/pay/4yncvhtn4wiu"},   // Flutterwave payment links
    raenest:{complete:"",accelerator:"",launch:""},       // Raenest payment links
    Paystack:{complete:"https://paystack.shop/pay/fshmcomplete",accelerator:"https://paystack.shop/pay/acelerator",launch:"https://paystack.shop/pay/launched"},        // e.g. https://www.paystack.com/ncp/payment/XXXX or paypal.me/yourname/{amount}USD
    card:{complete:"",accelerator:"",launch:""}           // credit/debit card checkout link
  },
  /* Confirmation email with the unique reference, sent by EmailJS (free tier, no server).
     Create a service and template at emailjs.com. Template variables: to_name, to_email, plan, amount, reference, date. */
  emailjs:{publicKey:"",serviceId:"",templateId:""}
};
