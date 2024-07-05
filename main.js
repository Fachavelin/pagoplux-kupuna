let params = new URLSearchParams(window.location.search);

let id = params.get('id'); // 'value1'
let plan = params.get('plan'); // 'value2'

console.log(id); // Imprime 'value1'
console.log(plan);

var data = {
  PayboxRemail: 'hola@kupuna.io',
  PayboxSendmail: 'hola@kupuna.io',
  PayboxRename: 'Nombre Negocio',
  PayboxSendname: 'Nombre tarjetahabiente',
  PayboxBase0: '10.0',
  PayboxBase12: '12.0',
  PayboxDescription: 'Descripcion del pago',
  PayboxLanguage: 'es',
  PayboxDirection: 'Direccion tarjetahabiente',
  PayBoxClientPhone: 'Telefono tarjetahabiente',
  PayboxProduction: false,
  PayboxRecurrent: true,
  PayboxIdPlan: '436',
  PayboxPermitirCalendarizar: true,
  PayboxPagoInmediato: true,
  PayboxCobroPrueba: false,
  PayBoxClientIdentification: 'Cedula tarjetahabiente',
  PayboxAmountVariablePlan: true,
  PayboxFrequencyPlan: 'MEN',
  PayboxTieneIvaPlan: true,
  PayboxDescriptionPlan: 'Descripcion plan',
  PayboxEnvironment: 'sandbox',
  PayboxPagoPlux: false,
  PayboxIdElement: 'idElementoTest',
};

var onAuthorize = function (response) {
  // La variable response posee un Objeto con la respuesta de PagoPlux.
  if (response.status == 'succeeded') {
    console.log('Payment succeeded');
  }
};

function fetchDataAndUpdateData() {
  fetch(`https://kupunaidentityapidev.azurewebsites.net/User/${id}`)
    .then((response) => response.json())
    .then((newData) => {
      // data.PayboxBase0 = '6.99';
      // data.PayboxBase12 = '8.04';
      data.PayboxSendname = newData.firstName;
      data.PayBoxClientIdentification = newData.userName;
      data.PayBoxClientPhone = '0986097821';

      console.log('Data after fetch:', data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });

  fetch(`https://kupunasubscriptionapidev.azurewebsites.net/api/Subscription/plans`)
    .then((response) => response.json())
    .then((newData) => {
      const idToFind = plan ?? 'individual';
      const foundObject = newData.find((item) => item.name === idToFind);

      data.PayboxDescription = foundObject.name;
      data.PayboxDescriptionPlan = foundObject.name;
      data.PayboxIdPlan = '436';
      data.PayboxBase0 = foundObject.price.toString();
      data.PayboxBase12 = GetValueWithTax(foundObject.price).toString();

      console.log(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

function GetValueWithTax(price) {
  let result = price + price * 0.15;
  return Number(result.toFixed(2));
}

fetchDataAndUpdateData();
