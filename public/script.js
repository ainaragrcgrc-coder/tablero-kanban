const API_URL = "http://localhost:3000/tasks";
const COMMENTS_URL = "http://localhost:3000/comments";
const USERS_URL = "http://localhost:3000/users";

let tareaSeleccionadaId = null;
let todasLasTareas = [];
let todosLosUsuarios = [];


// ==============================
// CARGAR USUARIOS
// ==============================

async function cargarUsuarios() {

    try {

        const respuesta = await fetch(USERS_URL);
        const usuarios = await respuesta.json();

        todosLosUsuarios = usuarios;

        const responsable =
            document.getElementById("responsable");

        responsable.innerHTML =
            '<option value="">Seleccionar responsable</option>';

        usuarios.forEach(usuario => {

            const opcion = document.createElement("option");

            opcion.value = usuario.id;
            opcion.textContent = usuario.name;

            responsable.appendChild(opcion);

        });

    } catch (error) {

        console.error(
            "Error al cargar los usuarios:",
            error
        );

    }

}


// ==============================
// CARGAR TAREAS
// ==============================

async function cargarTareas() {

    try {

        const respuesta = await fetch(API_URL);
        const tareas = await respuesta.json();

        todasLasTareas = tareas;

        mostrarTareas(tareas);

    } catch (error) {

        console.error(
            "Error al cargar las tareas:",
            error
        );

    }

}


// ==============================
// MOSTRAR TAREAS
// ==============================

function mostrarTareas(tareas) {

    document.getElementById("totalTareas").textContent =
        tareas.length;

    document.getElementById("totalTodo").textContent =
        tareas.filter(tarea => tarea.status === "todo").length;

    document.getElementById("totalDoing").textContent =
        tareas.filter(tarea => tarea.status === "doing").length;

    document.getElementById("totalDone").textContent =
        tareas.filter(tarea => tarea.status === "done").length;


    const todo =
        document.getElementById("todo");

    const doing =
        document.getElementById("doing");

    const done =
        document.getElementById("done");


    todo.innerHTML = "";
    doing.innerHTML = "";
    done.innerHTML = "";


    tareas.forEach(tarea => {

        const tarjeta =
            document.createElement("div");

        tarjeta.classList.add("tarjeta");

        tarjeta.dataset.id = tarea.id;


        // RESPONSABLE

        const usuario =
            todosLosUsuarios.find(
                usuario =>
                    String(usuario.id) ===
                    String(tarea.assignedTo)
            );


        const nombreUsuario =
            usuario ? usuario.name : "Sin asignar";


        const avatarUsuario =
            usuario ? usuario.avatar : "?";


        // CONTENIDO DE LA TARJETA

        tarjeta.innerHTML = `
            <h3>${tarea.title}</h3>

            <p>${tarea.description}</p>

            <p>Prioridad: ${tarea.priority}</p>

            <p>Fecha límite: ${tarea.dueDate}</p>

            <p>
                👤 ${avatarUsuario} ${nombreUsuario}
            </p>

            <p>
                🏷️ ${tarea.tag || "Sin etiqueta"}
            </p>
        `;


        tarjeta.addEventListener("click", () => {

            abrirDetalleTarea(tarea);

        });


        // BUSCAR LA COLUMNA SEGÚN EL STATUS

        const columnaDestino =
            document.querySelector(
                `.tarjetas[data-status="${tarea.status}"]`
            );


        if (columnaDestino) {

            columnaDestino.appendChild(tarjeta);

        }

    });

}


// ==============================
// CARGAR COMENTARIOS
// ==============================

async function cargarComentarios(taskId) {

    const listaComentarios =
        document.getElementById("listaComentarios");

    listaComentarios.innerHTML = "";


    try {

        const respuesta =
            await fetch(COMMENTS_URL);

        const comentarios =
            await respuesta.json();


        const comentariosTarea =
            comentarios.filter(
                comentario =>
                    String(comentario.taskId) ===
                    String(taskId)
            );


        comentariosTarea.forEach(comentario => {

            const elemento =
                document.createElement("div");


            elemento.innerHTML = `
                <strong>${comentario.author}</strong>
                <p>${comentario.text}</p>
            `;


            listaComentarios.appendChild(elemento);

        });


    } catch (error) {

        console.error(
            "Error al cargar los comentarios:",
            error
        );

    }

}


// ==============================
// ABRIR DETALLE DE TAREA
// ==============================

function abrirDetalleTarea(tarea) {

    const modalDetalleTarea =
        document.getElementById("modalDetalleTarea");


    tareaSeleccionadaId =
        tarea.id;


    document.getElementById("detalleTitulo").value =
        tarea.title;


    document.getElementById("detalleDescripcion").value =
        tarea.description;


    cargarComentarios(tarea.id);


    modalDetalleTarea.classList.remove("oculto");

}


// ==============================
// CERRAR DETALLE
// ==============================

const btnCerrarDetalle =
    document.getElementById("btnCerrarDetalle");


btnCerrarDetalle.addEventListener("click", () => {

    document
        .getElementById("modalDetalleTarea")
        .classList.add("oculto");

});


// ==============================
// NUEVA TAREA
// ==============================

const btnNuevaTarea =
    document.getElementById("btnNuevaTarea");


const modalNuevaTarea =
    document.getElementById("modalNuevaTarea");


const btnCerrarModal =
    document.getElementById("btnCerrarModal");


const formNuevaTarea =
    document.getElementById("formNuevaTarea");


btnNuevaTarea.addEventListener("click", () => {

    modalNuevaTarea.classList.remove("oculto");

});


btnCerrarModal.addEventListener("click", () => {

    modalNuevaTarea.classList.add("oculto");

});


// ==============================
// CREAR TAREA
// ==============================

formNuevaTarea.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const nuevaTarea = {

            title:
                document.getElementById("titulo").value,

            description:
                document.getElementById("descripcion").value,

            priority:
                document.getElementById("prioridad").value,

            dueDate:
                document.getElementById("fecha").value,

            status: "todo",

            assignedTo:
                document.getElementById("responsable").value,

            tag:
                document.getElementById("etiqueta").value

        };


        try {

            const respuesta =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(nuevaTarea)

                });


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo crear la tarea"
                );

            }


            formNuevaTarea.reset();


            modalNuevaTarea.classList.add("oculto");


            cargarTareas();


        } catch (error) {

            console.error(
                "Error al crear la tarea:",
                error
            );

        }

    }
);


// ==============================
// EDITAR TAREA
// ==============================

const formEditarTarea =
    document.getElementById("formEditarTarea");


formEditarTarea.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const tareaActualizada = {

            title:
                document.getElementById(
                    "detalleTitulo"
                ).value,

            description:
                document.getElementById(
                    "detalleDescripcion"
                ).value

        };


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/${tareaSeleccionadaId}`,
                    {

                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                tareaActualizada
                            )

                    }
                );


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo actualizar la tarea"
                );

            }


            document
                .getElementById("modalDetalleTarea")
                .classList.add("oculto");


            cargarTareas();


        } catch (error) {

            console.error(
                "Error al editar la tarea:",
                error
            );

        }

    }
);


// ==============================
// AÑADIR COMENTARIO
// ==============================

const formComentario =
    document.getElementById("formComentario");


formComentario.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const nuevoComentario = {

            taskId:
                tareaSeleccionadaId,

            author:
                document.getElementById(
                    "autorComentario"
                ).value,

            text:
                document.getElementById(
                    "textoComentario"
                ).value,

            createdAt:
                new Date().toISOString()

        };


        try {

            const respuesta =
                await fetch(
                    COMMENTS_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                nuevoComentario
                            )

                    }
                );


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo añadir el comentario"
                );

            }


            formComentario.reset();


            cargarComentarios(
                tareaSeleccionadaId
            );


        } catch (error) {

            console.error(
                "Error al añadir el comentario:",
                error
            );

        }

    }
);


// ==============================
// ELIMINAR TAREA
// ==============================

const btnEliminarTarea =
    document.getElementById(
        "btnEliminarTarea"
    );


btnEliminarTarea.addEventListener(
    "click",
    async () => {

        if (!tareaSeleccionadaId) {

            return;

        }


        const confirmar =
            confirm(
                "¿Seguro que quieres eliminar esta tarea?"
            );


        if (!confirmar) {

            return;

        }


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/${tareaSeleccionadaId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo eliminar la tarea"
                );

            }


            document
                .getElementById(
                    "modalDetalleTarea"
                )
                .classList.add("oculto");


            tareaSeleccionadaId = null;


            cargarTareas();


        } catch (error) {

            console.error(
                "Error al eliminar la tarea:",
                error
            );

        }

    }
);


// ==============================
// MOVER TAREAS
// ==============================

function activarDragAndDrop(zona) {

    new Sortable(zona, {

        group: "kanban",

        animation: 150,


        onEnd: async (evento) => {

            const tarjeta =
                evento.item;


            const nuevoStatus =
                evento.to.dataset.status;


            const idTarea =
                tarjeta.dataset.id;


            try {

                const respuesta =
                    await fetch(
                        `${API_URL}/${idTarea}`,
                        {

                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    status:
                                        nuevoStatus
                                })

                        }
                    );


                if (!respuesta.ok) {

                    throw new Error(
                        "No se pudo actualizar la tarea"
                    );

                }


                cargarTareas();


            } catch (error) {

                console.error(
                    "Error al actualizar la tarea:",
                    error
                );

            }

        }

    });

}


// Activar drag & drop en las columnas originales

const columnas =
    document.querySelectorAll(".tarjetas");


columnas.forEach(columna => {

    activarDragAndDrop(columna);

});


// ==============================
// BUSCADOR
// ==============================

const buscadorTareas =
    document.getElementById(
        "buscadorTareas"
    );


buscadorTareas.addEventListener(
    "input",
    () => {

        aplicarFiltros();

    }
);


// ==============================
// FILTROS AVANZADOS
// ==============================

const filtroPrioridad =
    document.getElementById(
        "filtroPrioridad"
    );


const filtroEtiqueta =
    document.getElementById(
        "filtroEtiqueta"
    );


const filtroResponsable =
    document.getElementById(
        "filtroResponsable"
    );


// ==============================
// FILTRO DE RESPONSABLES
// ==============================

function cargarResponsablesFiltro() {

    filtroResponsable.innerHTML =
        '<option value="">Todos</option>';


    todosLosUsuarios.forEach(usuario => {

        const opcion =
            document.createElement("option");


        opcion.value =
            usuario.id;


        opcion.textContent =
            usuario.name;


        filtroResponsable.appendChild(
            opcion
        );

    });

}


// ==============================
// APLICAR FILTROS
// ==============================

function aplicarFiltros() {

    const prioridadSeleccionada =
        filtroPrioridad.value;


    const etiquetaSeleccionada =
        filtroEtiqueta.value;


    const responsableSeleccionado =
        filtroResponsable.value;


    const textoBuscado =
        buscadorTareas.value
            .toLowerCase()
            .trim();


    const tareasFiltradas =
        todasLasTareas.filter(tarea => {

            const coincideTexto =
                tarea.title
                    .toLowerCase()
                    .includes(textoBuscado);


            const coincidePrioridad =
                !prioridadSeleccionada ||
                tarea.priority ===
                    prioridadSeleccionada;


            const coincideEtiqueta =
                !etiquetaSeleccionada ||
                tarea.tag ===
                    etiquetaSeleccionada;


            const coincideResponsable =
                !responsableSeleccionado ||
                String(tarea.assignedTo) ===
                    String(responsableSeleccionado);


            return (
                coincideTexto &&
                coincidePrioridad &&
                coincideEtiqueta &&
                coincideResponsable
            );

        });


    mostrarTareas(tareasFiltradas);

}


filtroPrioridad.addEventListener(
    "change",
    aplicarFiltros
);


filtroEtiqueta.addEventListener(
    "change",
    aplicarFiltros
);


filtroResponsable.addEventListener(
    "change",
    aplicarFiltros
);


// ==============================
// COLUMNAS DINÁMICAS
// ==============================

const nombreColumna =
    document.getElementById(
        "nombreColumna"
    );


const btnNuevaColumna =
    document.getElementById(
        "btnNuevaColumna"
    );


const tablero =
    document.querySelector(".tablero");


// Crear columna

function crearColumna(nombre) {

    const columna =
        document.createElement("div");


    columna.classList.add("columna");


    const identificador =
        nombre
            .toLowerCase()
            .replace(/\s+/g, "-");


    columna.innerHTML = `
        <h2>${nombre}</h2>

        <div
            class="tarjetas"
            data-status="${identificador}"
        ></div>
    `;


    tablero.appendChild(columna);


    const nuevaZona =
        columna.querySelector(".tarjetas");


    activarDragAndDrop(nuevaZona);

}


// Cargar columnas guardadas

function cargarColumnasGuardadas() {

    const columnasGuardadas =
        JSON.parse(
            localStorage.getItem(
                "columnasKanban"
            )
        ) || [];


    columnasGuardadas.forEach(nombre => {

        crearColumna(nombre);

    });

}


// Añadir columna

btnNuevaColumna.addEventListener(
    "click",
    () => {

        const nombre =
            nombreColumna.value.trim();


        if (!nombre) {

            alert(
                "Escribe un nombre para la columna"
            );

            return;

        }


        const columnasGuardadas =
            JSON.parse(
                localStorage.getItem(
                    "columnasKanban"
                )
            ) || [];


        columnasGuardadas.push(nombre);


        localStorage.setItem(
            "columnasKanban",
            JSON.stringify(
                columnasGuardadas
            )
        );


        crearColumna(nombre);


        nombreColumna.value = "";

    }
);


// ==============================
// MENÚ HAMBURGUESA
// ==============================

const btnMenu =
    document.getElementById("btnMenu");


const menuNavegacion =
    document.getElementById(
        "menuNavegacion"
    );


btnMenu.addEventListener(
    "click",
    () => {

        menuNavegacion.classList.toggle(
            "menu-abierto"
        );

    }
);


// ==============================
// INICIAR APLICACIÓN
// ==============================

async function iniciarAplicacion() {

    await cargarUsuarios();

    cargarResponsablesFiltro();

    cargarColumnasGuardadas();

    await cargarTareas();

}


iniciarAplicacion();