// Variables 
const pacienteInput = document.querySelector('#paciente');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#textArea');

// Variables para nueva cita
const formulario = document.querySelector('#nuevaCita');
// nuevaCita.addEventListener('submit', formularioEnviado);

// Variables cita creada 
const citaCreada = document.querySelector('#citaCreada');

let editando = false;

// Clases
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
        console.log(this.citas)
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id)
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('p-4', 'bg-red-400', 'rounded-2xl', 'mt-4','text-lg');

        // Clase segun el tipo de error
        if(tipo === 'error') {
            divMensaje.classList.add('bg-red-700', 'p-4', 'rounded-2xl', 'text-white', 'text-lg', 'mt-4');
        } else {
            divMensaje.classList.add('bg-green-600', 'p-4', 'text-white', 'rounded-2xl', 'text-lg', 'mt-4')
        }
        
        // Mandar mensaje de error
        divMensaje.textContent = mensaje;

        document.querySelector('#datosPaciente').appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas({citas}) {

        this.limpiarHTML();

        citas.forEach( cita => {
            const { paciente, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('p-2', 'bg-neutral-300', 'rounded-xl', 'mt-4');
            divCita.dataset.id = id;

            const pacienteParrafo = document.createElement('h2');
            pacienteParrafo.classList.add('font-bold', 'text-2xl', 'text-neutral-800');
            pacienteParrafo.textContent = paciente;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class='font-bold'>Telefono:</span> ${telefono}
            `
            
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class='font-bold'>Fecha:</span> ${fecha}
            `

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class='font-bold'>Hora:</span> ${hora}
            `

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class='font-bold'>Sintomas:</span> ${sintomas}
            `    

            // Boton para eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('bg-red-600', 'p-3', 'rounded-xl', 'font-bold', 'text-white', 'w-full', 'mt-6','flex', 'justify-center');
            btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
           
            // Btn eliminar cita
            btnEliminar.onclick = () => eliminarCita(id);

            // Btn editar cita
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('bg-amber-500', 'p-3', 'rounded-xl', 'font-bold', 'text-white','w-full', 'mt-6', 'flex' ,'justify-center')
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            btnEditar.onclick = () => cargarEdicion(cita);

            // Agregar los parrafos al divCita
            divCita.appendChild(pacienteParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);
            
            // Agregar al html
            citaCreada.appendChild(divCita);
        })
    }

    limpiarHTML() {
        while(citaCreada.firstChild) {
            citaCreada.removeChild( citaCreada.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

// Eventos 
eventListeners();
function eventListeners() {
    pacienteInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

const citaObj = {
    paciente: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Funciones 
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;

}

// Valida y agrega nueva cita a la clase de citas 
function nuevaCita(e) {
    e.preventDefault();

    // Destructuring de citaObj
    const { paciente, telefono, fecha, hora, sintomas } = citaObj;

    // Validacion 
    if(paciente === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los datos son obligatorios', 'error');

        return;
    }

    if(editando) {
        ui.imprimirAlerta('Editado correctamente')

        administrarCitas.editarCita({...citaObj})

        // Regresar el boton al modo anterior
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

        // Quitar modo edicion
        editando = false;
    } else {
        // Generar un id unico
        citaObj.id = Date.now()

        // Creando una nueva cita en caso de validacion correcta 
        administrarCitas.agregarCita({...citaObj});

        // Mensaje agregado correctamente
        ui.imprimirAlerta('Se agrego correctamente')

    }

    //Reiniciar obj 
    reiniciarObj();

    // Resetear el formulario
    formulario.reset();

    // Mostrar citas en el html
    ui.imprimirCitas(administrarCitas)
}

function reiniciarObj() {
    citaObj.paciente = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    // Elimina la cita
    administrarCitas.eliminarCita(id);

    // Imprime el mensaje de error
    ui.imprimirAlerta('La cita se elimino correctamente');

    // Refresca las citas
    ui.imprimirCitas(administrarCitas)
}

function cargarEdicion(cita) {

    const { paciente, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar los inputs
    pacienteInput.value = paciente;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;
    
    // Llenar el objeto
    citaObj.paciente = paciente;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}