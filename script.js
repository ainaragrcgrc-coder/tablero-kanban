const API_URL = "http://localhost:3000/tasks";

async function cargarTareas() {
    try {
        const respuesta = await fetch(API_URL);
        const tareas = await respuesta.json();

        mostrarTareas(tareas);

    } catch (error) {
        console.error("Error al cargar las tareas:", error);
    }
}

function mostrarTareas(tareas) {

    const todo = document.getElementById("todo");
    const doing = document.getElementById("doing");
    const done = document.getElementById("done");

    todo.innerHTML = "";
    doing.innerHTML = "";
    done.innerHTML = "";

    tareas.forEach(tarea => {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML = `
            <h3>${tarea.title}</h3>
            <p>${tarea.description}</p>
            <p>Prioridad: ${tarea.priority}</p>
            <p>Fecha límite: ${tarea.dueDate}</p>
        `;

        if (tarea.status === "todo") {
            todo.appendChild(tarjeta);
        }

        if (tarea.status === "doing") {
            doing.appendChild(tarjeta);
        }

        if (tarea.status === "done") {
            done.appendChild(tarjeta);
        }
    });
}

cargarTareas();

const btnNuevaTarea = document.getElementById("btnNuevaTarea");
const modalNuevaTarea = document.getElementById("modalNuevaTarea");
const btnCerrarModal = document.getElementById("btnCerrarModal");
console.log(btnCerrarModal);
const formNuevaTarea = document.getElementById("formNuevaTarea");
console.log("SCRIPT CARGADO");


btnNuevaTarea.addEventListener("click", () => {
    modalNuevaTarea.classList.remove("oculto");
});

btnCerrarModal.addEventListener("click", () => {
    console.log("SE HA PULSADO CANCELAR");
    modalNuevaTarea.style.display = "none";
});

formNuevaTarea.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nuevaTarea = {
        title: document.getElementById("titulo").value,
        description: document.getElementById("descripcion").value,
        priority: document.getElementById("prioridad").value,
        dueDate: document.getElementById("fecha").value,
        status: "todo"
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevaTarea)
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo crear la tarea");
        }

        formNuevaTarea.reset();
        modalNuevaTarea.classList.add("oculto");

        cargarTareas();

    } catch (error) {
        console.error("Error al crear la tarea:", error);
    }
});
const columnas = document.querySelectorAll(".tarjetas");

columnas.forEach(columna => {
    new Sortable(columna, {
        group: "kanban",
        animation: 150
    });
});
