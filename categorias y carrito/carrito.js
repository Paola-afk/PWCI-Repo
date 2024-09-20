
const paymentMethod = document.getElementById('payment-method');
const formTarjeta = document.getElementById('form-tarjeta');
const formPayPal = document.getElementById('form-paypal');
const formTransferencia = document.getElementById('form-transferencia');
const termsAnConditions = document.getElementById('terms');

document.addEventListener('DOMContentLoaded', function () {

    total();

});


paymentMethod.addEventListener('change', function () {
    // Ocultar todos los formularios
    formTarjeta.classList.add('hidden');
    formPayPal.classList.add('hidden');
    formTransferencia.classList.add('hidden');

    // Mostrar formulario correspondiente al método de pago seleccionado
    switch (paymentMethod.value) {
        case 'tarjeta':
            formTarjeta.classList.remove('hidden');
            break;
        case 'paypal':
            formPayPal.classList.remove('hidden');
            break;
        case 'transferencia':
            formTransferencia.classList.remove('hidden');
            break;
    }
});


function total(){

const totalDisplay = document.getElementById('totalDisplay');
const prices = document.querySelectorAll('.price');

    const sumTotal = () => {
        let totalPrices = 0;

        prices.forEach((price) => {

            console.log(price.textContent)

            totalPrices += parseFloat(price.textContent); 
        });

        return totalPrices;
    };

    if (totalDisplay) {
        totalDisplay.textContent = ` ${sumTotal().toFixed(2)}`; // Mostrar el total formateado a 2 decimales
    }

} 

function agregarAlCarrito() {

event.preventDefault();

let complete = false; 
let terms = false;

if(!termsAnConditions.checked){

    Swal.fire({
    title: '¡Aviso! ',
    text: 'Tiene que aceptar los terminos y condiciones para poder continuar',
    icon: 'warning',
    confirmButtonText: 'Ok',
    })

    terms = false;
}
else
    terms = true;
    


if(paymentMethod.value != "") {
    switch (paymentMethod.value) {
        case 'tarjeta':
            console.log("Eligió tarjeta");
            complete = validarFormularioTarjetas();
            break;
        case 'paypal':
            console.log("Eligió PayPal");
            complete = validarFormularioPaypal();
            break;
        case 'transferencia':
            console.log("Eligió transferencia");
            complete = validarTransferencia();
            break;
    }

    if (complete) {
        Swal.fire({
            title: 'Curso Agregado al Carrito',
            text: 'Has agregado el curso de Desarrollo Web Completo a tu carrito.',
            icon: 'success',
            confirmButtonText: 'Continuar'
        });
        return true;
    } 
} else if (terms){
    Swal.fire({
    title: '¡Aviso! ',
    text: 'Por favor ingresa un metodo de pago previamente',
    icon: 'warning',
    confirmButtonText: 'Ok',
})
}


}

function eliminarDelCarrito() {
Swal.fire({
    title: '¡Chanfles! ',
    text: '¿Deseas eliminar este curso de tu carrito?',
    icon: 'error',
    confirmButtonText: 'Sí, eliminarlo',
    cancelButtonText: 'Cancelar'
})
}

function validarFormularioTarjetas() {

const numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
const fechaExpiracion = document.getElementById("fechaExpiracion").value.trim();
const cvv = document.getElementById("cvv").value.trim();

console.log("Esta entrando");
if (numeroTarjeta === "" || !/^\d{16}$/.test(numeroTarjeta)) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese un número de tarjeta válido de 16 dígitos.',
        confirmButtonText: 'Continuar'
    })
    return false;
}
if (fechaExpiracion === "" || !/^\d{2}\/\d{2}$/.test(fechaExpiracion)) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese una fecha de expiración válida (MM/YY).'
    });
    return false;
}
if (cvv === "" || !/^\d{3}$/.test(cvv)) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese un CVV válido de 3 dígitos.'
    });
    return false;
}
Swal.fire({
    icon: 'success',
    title: 'Pago realizado',
    text: 'Su pago con tarjeta de crédito ha sido procesado exitosamente.'
});

}

function validarFormularioPaypal() {
const emailPaypal = document.getElementById("emailPaypal").value.trim();
const passwordPaypal = document.getElementById("passwordPaypal").value.trim(); // Asegúrate de tener este elemento en tu HTML

if (emailPaypal === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailPaypal)) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese un correo electrónico válido.'
    });
    return false;
}
if (passwordPaypal === "" || passwordPaypal.length < 6) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese una contraseña válida de al menos 6 caracteres.'
    });
    return false;
}
Swal.fire({
    icon: 'success',
    title: 'Pago realizado',
    text: 'Su pago con PayPal ha sido procesado exitosamente.'
});
return true;
}

function validarTransferencia() {
const nombreBanco = document.getElementById("nombreBanco").value.trim();
    const numCuenta = document.getElementById("numCuenta").value.trim();

    if (nombreBanco === "" || nombreBanco.length < 3) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese el nombre del banco con al menos 3 caracteres.'
        });
        return false;
    }

    if (numCuenta === "" || !/^\d{10,20}$/.test(numCuenta)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un número de cuenta válido (10-20 dígitos).'
        });
        return false;
    }

    Swal.fire({
        icon: 'success',
        title: 'Pago realizado',
        text: 'Su pago mediante transferencia bancaria ha sido procesado exitosamente.'
    });
    return true;    
}

