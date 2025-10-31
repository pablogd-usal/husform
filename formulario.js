document.addEventListener('DOMContentLoaded', function() {

    // Event listener para el botón de imprimir
    document.getElementById("imprimirBtn").addEventListener("click", function() {

        if (!validarFormulario()) {

            const errorGeneral = document.createElement("div");
            errorGeneral.style.color = "red";
            errorGeneral.style.fontSize = "14px";
            errorGeneral.style.fontWeight = "bold";
            errorGeneral.style.marginTop = "10px";
            errorGeneral.style.textAlign = "center";
            errorGeneral.textContent = "Faltan campos por completar. Por favor, revise los mensajes de error en rojo.";
            
            // Eliminar mensaje anterior si existe
            const mensajeAnterior = document.getElementById("errorGeneral");
            
            if (mensajeAnterior) {
                mensajeAnterior.remove();
            }
            
            errorGeneral.id = "errorGeneral";
            document.querySelector(".botones").appendChild(errorGeneral);
        } else {
            // Eliminar mensaje de error si existe
            const mensajeError = document.getElementById("errorGeneral");
            if (mensajeError) {
                mensajeError.remove();
            }
            window.print();
        }
    });

    // Event listeners para los checkboxes de sexo
    // document.getElementById("checkboxMasculino").addEventListener("change", actualizarSexoSeleccionado);
    // document.getElementById("checkboxFemenino").addEventListener("change", actualizarSexoSeleccionado);

    // Event listeners para los radio buttons de momento evolutivo
    const radioButtons = document.querySelectorAll('input[name="momentoEvolutivo"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const otrosInputDiv = document.querySelector('.otrosInput');
            if (this.id === 'emr') {
                mostrarCampoTextoEMR();
                otrosInputDiv.style.display = 'none';
            } else if (this.id === 'otrosEvolutivos') {
                otrosInputDiv.style.display = 'block';
                document.getElementById('otrosInputEvolutivo').focus();
                const emrMarkerDiv = document.getElementById('emrMarker');
                emrMarkerDiv.style.display = 'none';
            } else {
                otrosInputDiv.style.display = 'none';
                const emrMarkerDiv = document.getElementById('emrMarker');
                emrMarkerDiv.style.display = 'none';
            }
        });
    });

    // Event listeners para los radio buttons de tipo de muestra
    const tipoMuestraRadios = document.querySelectorAll('input[name="tipoMuestra"]');
    tipoMuestraRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const inputMuestraDiv = document.querySelector('.inputMuestra');
            if (this.id === 'otrosTejidos' || this.id === 'liquido' || this.id === 'otrosMuestra') {
                inputMuestraDiv.style.display = 'block';
                document.getElementById('otrosInputMuestra').focus();
            } else {
                inputMuestraDiv.style.display = 'none';
            }
        });
    });

    // Event listeners para los checkboxes de otros estudios
    const otrosEstudiosCheckboxes = document.querySelectorAll('input[name="otrosEstudios"]');
    const justificacionDiv = document.getElementById('justificacionOtrosEstudios');
    
    otrosEstudiosCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const anyChecked = Array.from(otrosEstudiosCheckboxes).some(cb => cb.checked);
            justificacionDiv.style.display = anyChecked ? 'block' : 'none';
        });
    });

    // Event listener para la opción de exón 12
    const exon12Checkbox = document.getElementById('exon12');
    const notaExon12 = document.getElementById('notaExon12');
    
    if (exon12Checkbox) {
        exon12Checkbox.addEventListener('change', function() {
            if (this.checked) {
                notaExon12.style.display = 'block';
                justificacionDiv.style.display = 'block';
            } else {
                notaExon12.style.display = 'none';
                // Solo ocultar la justificación si no hay otros estudios seleccionados
                const otrosEstudiosCheckboxes = document.querySelectorAll('input[name="otrosEstudios"]:checked');
                if (otrosEstudiosCheckboxes.length === 0) {
                    justificacionDiv.style.display = 'none';
                }
            }
        });
    }

    // Inicializar el estado del sexo
    // actualizarSexoSeleccionado();
});

// Variables para almacenar errores y evitar duplicados
let errorDiagnostico, errorMedico, errorEmail, errorTelefono, errorHospital, errorTratamiento, errorInput, errorEnsayo, errorTipoMuestra, errorSospechaDiagnostico;

function guardarMomentoEvolutivo() {
    const momentoEvolutivoElement = document.querySelector('input[name="momentoEvolutivo"]:checked');
    let momentoEvolutivo = momentoEvolutivoElement ? momentoEvolutivoElement.id : 'No seleccionado';
    const emrMarkerDiv = document.getElementById('emrMarker');

    if (momentoEvolutivo === 'emr') {
        emrMarkerDiv.style.display = 'block';
        document.getElementById('marcadorMolecular').focus();
    } else {
        emrMarkerDiv.style.display = 'none';
    }

    if (momentoEvolutivo === 'otrosEvolutivos') {
        const textoMomento = document.getElementById('otrosInputEvolutivo').value.trim();
        momentoEvolutivo = textoMomento ? `Otros: ${textoMomento}` : 'Otros: No especificado';
    }

    document.getElementById('momentoEvolutivoSeleccionado').value = momentoEvolutivo;
    console.log("Momento Evolutivo Guardado:", momentoEvolutivo);
}

function mostrarCampoTextoMomento() {
    const momentoEvolutivoElement = document.querySelector('input[name="momentoEvolutivo"]:checked');
    const otrosInputDiv = document.querySelector('.otrosInput');

    if (momentoEvolutivoElement && momentoEvolutivoElement.id === 'otrosEvolutivos') {
        otrosInputDiv.style.display = 'block';
        document.getElementById('otrosInputEvolutivo').focus();
    } else {
        otrosInputDiv.style.display = 'none';
    }
}

function guardarTipoMuestra() {
    const tipoMuestraElement = document.querySelector('input[name="tipoMuestra"]:checked');
    let tipoMuestra = tipoMuestraElement ? tipoMuestraElement.id : 'No seleccionado';

    if (tipoMuestra === 'otrosTejidos' || tipoMuestra === 'otrosMuestra' || tipoMuestra === 'liquido') {
        const textoMuestra = document.getElementById('otrosInputMuestra').value.trim();
        tipoMuestra = textoMuestra ? `Otros: ${textoMuestra}` : 'Otros: No especificado';
    } else if (tipoMuestraElement) {
        tipoMuestra = tipoMuestraElement.nextElementSibling.textContent.trim();
    }

    document.getElementById('tipoMuestraSeleccionado').value = tipoMuestra;
    console.log("Tipo de Muestra Guardado:", tipoMuestra);
}

function mostrarCampoTexto() {
    const tipoMuestraElement = document.querySelector('input[name="tipoMuestra"]:checked');
    const inputMuestraDiv = document.querySelector('.inputMuestra');

    if (tipoMuestraElement && (tipoMuestraElement.id === 'otrosTejidos' || tipoMuestraElement.id === 'liquido' || tipoMuestraElement.id === 'otrosMuestra')) {
        inputMuestraDiv.style.display = 'block';
        document.getElementById('otrosInputMuestra').focus();
    } else {
        inputMuestraDiv.style.display = 'none';
    }
}

function ocultarCampoTexto() {
    document.querySelector('.inputMuestra').style.display = 'none';
}

function guardarOpcionEstudio(opcion, event) {
    event.preventDefault();
    const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
    //# dropdownItems.forEach(item => {
    //#     item.classList.remove('selected');
    //# });

    // Toggle la clase selected en el elemento clickeado
    const clickedItem = Array.from(dropdownItems).find(item => item.textContent.trim() === opcion);
    //# clickedItem.classList.toggle('selected');
    // eliminar la clase selected de todos los elementos

    if (clickedItem) {
        clickedItem.classList.toggle('selected');
    }

    // Obtener los estudios seleccionados
    
    const selectedItems = Array.from(dropdownItems)
        .filter(item => item.classList.contains('selected'))
        .map(item => item.textContent.trim());
    //# const selectedItem = document.querySelector('.dropdown-menu .dropdown-item.selected');

    // Actualizar el texto del botón y el valor del input
    const button = document.getElementById('dropdownEstudios');
    const input = document.getElementById('estudiosSeleccionados');

    //# button.textContent = 'ESTUDIOS PROTOCOLIZADOS: ' + (clickedItem ? clickedItem.textContent.trim() : '');
    //# console.log("------->:", selectedItems, selectedItem, clickedItem);
    //# mostrarInformacionEstudio(clickedItem ? clickedItem.textContent.trim() : '');

    if (selectedItems.length > 0) {
        let buttonText = 'ESTUDIOS PROTOCOLIZADOS: ' + selectedItems.join(', ');
        button.textContent = buttonText;
        input.value = selectedItems.join(',');

        // Mostrar la información de los estudios
        mostrarInformacionEstudios(selectedItems);
    } else {
        button.textContent = 'ESTUDIOS PROTOCOLIZADOS:';
        input.value = '';
        const textoSeleccionado = document.getElementById('textoSeleccionado');
        textoSeleccionado.textContent = 'Selecciona una opción para ver los detalles.';
    }
}
function mostrarInformacionEstudio(estudio) {
    const textoSeleccionado = document.getElementById('textoSeleccionado');
    textoSeleccionado.innerHTML = ''; // Limpiar contenido anterior

    let mensajeHTML = '';
        
    if (estudio === "Leucemia aguda mieloblástica") {
        
        mensajeHTML = `<strong>Información específica sobre Leucemia aguda mieloblástica:</strong><br>
                        Cariotipo.<br>
                        FISH: 5q, 7q, C-8, KMT2A (MLL).<br>
                        Traslocaciones por qRT-PCR:<br>
                        <ul>
                            <li>t(15;17) – PML::RARA</li>
                            <li>t(8;21) – RUNX1::RUNX1T1</li>
                            <li>inv(16) – CBFB::MYH11</li>
                        </ul>
                        Mutaciones de NPM1, FLT3 y IDH1/2.<br>
                        Expresión WT1. Panel NGS mieloide: si candidato a TPH o si está incluido en la PLATAFO-LMA.<br>
                        <strong>Nota:</strong> En caso de sospecha morfológica y que se precise conocer el resultado en 24-48h se podrían solicitar los estudios de FISH de t(15;17) o t(8;21) o inv(16).`;

    } else if (estudio === "Leucemia aguda linfoblástica") {

        mensajeHTML = `<strong>Información específica sobre Leucemia aguda linfoblástica:</strong><br>
                        Cariotipo.<br>
                        B: Traslocaciones por FISH:<ul>
                            <li>t(9;22)</li>
                            <li>KMT2A (MLL)</li>
                            <li>t(1;19)</li>
                            <li>t(12;21)</li>
                            <li>qRT-PCR si positivo por FISH:<ul>
                                <li>t(9;22) – BCR::ABL</li>
                                <li>t(1;19) – TCF3::PBX1</li>
                                <li>t(4;11) – KMT2A::AF4</li>
                                <li>t(12;21) – ETV6::RUNX1</li>
                            </ul></li>
                        </ul>
                        T: SIL::TAL por qRT-PCR.`;

    } else if (estudio === "Síndrome mielodisplásico") {
        mensajeHTML = `<strong>Información específica sobre Síndrome mielodisplásico:</strong><br>
                        Cariotipo.<br>
                        FISH: 5q, 7q, C-8 y 20q.<br>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="sindromeMielodisplasicoOpciones" id="sindromeMielodisplasico1">
                            <label class="form-check-label" for="sindromeMielodisplasico1">Si candidato a ALO-TPH o si está incluido en estudio UMBRELLA: Panel de NGS mieloide</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="sindromeMielodisplasicoOpciones" id="sindromeMielodisplasico2">
                            <label class="form-check-label" for="sindromeMielodisplasico2">Si trombocitosis/fibrosis medular: Mutación de JAK2</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="sindromeMielodisplasicoOpciones" id="sindromeMielodisplasico3">
                            <label class="form-check-label" for="sindromeMielodisplasico3">Si eosinofilia: FISH de PDGFRA, PDGFRB, FGFR1, JAK2</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="sindromeMielodisplasicoOpciones" id="sindromeMielodisplasico4">
                            <label class="form-check-label" for="sindromeMielodisplasico4">Si SMD con del(5q): Mutaciones de TP53</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="sindromeMielodisplasicoOpciones" id="sindromeMielodisplasico5">
                            <label class="form-check-label" for="sindromeMielodisplasico5">Si bajo % de blastos: Mutaciones de SF3B1</label>
                        </div>
                        <div id="notaSindromeMielodisplasico">
                            Nota: Si al diagnóstico no se conoce esta información, se debe notificar vía mail posteriormente.
                        </div>`;
        
    } else if (estudio === "Leucemia mielomonocítica crónica") {

        mensajeHTML = `<strong>Información específica sobre Leucemia mielomonocítica crónica:</strong><br>
                        Cariotipo.<br>
                        FISH: 5q, 7q, C-8, 20q.<br>
                        Panel de NGS mieloide en pacientes candidatos a aloTPH.`;

    } else if (estudio === "Neoplasias mieloproliferativas crónicas no LMC") {

        mensajeHTML = `<strong>Información específica sobre Neoplasias mieloproliferativas crónicas no LMC:</strong><br>
                        Cariotipo.<br>
                        FISH: t(9;22).<br>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="mieloproliferativasOpciones" id="mieloproliferativas1">
                            <label class="form-check-label" for="mieloproliferativas1">Poliglobulia: Mutaciones de JAK2</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="mieloproliferativasOpciones" id="mieloproliferativas2">
                            <label class="form-check-label" for="mieloproliferativas2">Trombocitosis: Mutaciones de JAK2, CALR y MPL</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="mieloproliferativasOpciones" id="mieloproliferativas3">
                            <label class="form-check-label" for="mieloproliferativas3">Mielofibrosis: Mutaciones de JAK2, CALR y MPL</label>
                        </div>`;

    } else if (estudio === "Trombosis de territorios esplácnicos") {

        mensajeHTML = `<strong>Información específica sobre Trombosis de territorios esplácnicos:</strong><br>
                        Mutaciones de JAK2.`;

    } else if (estudio === "Leucemia mieloide crónica") {

        mensajeHTML = `<strong>Información específica sobre Leucemia mieloide crónica:</strong><br>
                        FISH: t(9;22).<br>
                        qRT-PCR: t(9;22) – BCR::ABL.<br>
                        Seguimiento: qRT-PCR de t(9;22) - BCR::ABL.`;

    } else if (estudio === "Eosinofilia") {
        
        mensajeHTML = `<strong>Información específica sobre Eosinofilia:</strong><br>
                        Cariotipo.<br>
                        FISH de PDGFRA y PDGFRB.`;

    } else if (estudio === "Leucemia neutrofílica crónica") {

        mensajeHTML = `<strong>Información específica sobre Leucemia neutrofílica crónica:</strong><br>
                        Mutaciones de CSF3R.`;

    } else if (estudio === "Mastocitosis") {

        mensajeHTML = `<strong>Información específica sobre Mastocitosis:</strong><br>
                        Cariotipo.<br>
                        Mutación de KIT.`;

    } else if (estudio === "Aplasia medular") {

        mensajeHTML = `<strong>Información específica sobre Aplasia medular:</strong><br>
                        Cariotipo en médula ósea.<br>
                        Fragilidad cromosómica en sangre periférica.`;

    } else if (estudio === "Citopenias aisladas") {

        mensajeHTML = `<strong>Información específica sobre Citopenias aisladas:</strong><br>
                        Cariotipo.<br>
                        Se guarda ADN hasta concretar diagnóstico.`;

    } else if (estudio === "Leucemia linfática crónica") {

        mensajeHTML = `<strong>Información específica sobre Leucemia linfática crónica:</strong><br>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc1">
                            <label class="form-check-label" for="llc1">Al diagnóstico: Cariotipo. Mutaciones de IGHV</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc2">
                            <label class="form-check-label" for="llc2">Antes de tratamiento/recaída: Cariotipo. FISH: C-12, 14q, 13q, 11q (ATM), 17p(TP53). Mutaciones TP53.</label>
                        </div>`;

    } else if (estudio === "Tricoleucemia") {

        mensajeHTML = `<strong>Información específica sobre Tricoleucemia:</strong><br>
                        Mutaciones de BRAF.`;

    } else if (estudio === "Sospecha de síndrome linfoproliferativo") {

        mensajeHTML = `<strong>Información específica sobre Sospecha de síndrome linfoproliferativo:</strong><br>
                        Se guardará ADN y células fijadas hasta definir el diagnóstico.`;

    } else if (estudio === "Linfoma de células B grandes difuso") {

        mensajeHTML = `<strong>Información específica sobre Linfoma de células B grandes difuso:</strong><br>
                        <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                            Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                            Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                        </div>
                        Cariotipo. FISH: BCL2, BCL6, MYC y TP53.`;

    } else if (estudio === "Linfoma folicular") {

        mensajeHTML = `<strong>Información específica sobre Linfoma folicular:</strong><br>
                        <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                            Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                            Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                        </div>
                        Cariotipo. FISH: t(14;18).`;

    } else if (estudio === "Linfoma de células del manto") {

        mensajeHTML = `<strong>Información específica sobre Linfoma de células del manto:</strong><br>
                        <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                            Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                            Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                        </div>
                        Cariotipo. FISH: t(11;14) y del(17p).<br>
                        Mutaciones de TP53.`;

    } else if (estudio === "Mieloma Múltiple") {

        mensajeHTML = `<strong>Información específica sobre Mieloma Múltiple:</strong><br>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="mielomaOpciones" id="mieloma1">
                            <label class="form-check-label" for="mieloma1">FISH: t(4;14), t(14;16), t(14;20), 1q/1p y 17p.</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="mielomaOpciones" id="mieloma2">
                            <label class="form-check-label" for="mieloma2">Mutaciones TP53.</label>
                        </div>`;

    } else if (estudio === "Macroglobulinemia de Waldestrom") {

        mensajeHTML = `<strong>Información específica sobre Macroglobulinemia de Waldestrom:</strong><br>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="waldestromOpciones" id="waldestrom1">
                            <label class="form-check-label" for="waldestrom1">FISH: del(6q), C-4, del(17p).</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="waldestromOpciones" id="waldestrom2">
                            <label class="form-check-label" for="waldestrom2">Mutaciones de MYD88 y CXCR4.</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="waldestromOpciones" id="waldestrom3">
                            <label class="form-check-label" for="waldestrom3">Antes de tratamiento/recaída: Mutaciones de TP53.</label>
                        </div>`;

    } else if (estudio === "Leucemia de linfocitos grandes granulares") {

        mensajeHTML = `<strong>Información específica sobre Leucemia de linfocitos grandes granulares:</strong><br>
                        Cariotipo.`;

    } else if (estudio === "Linfoma no hodgkin T") {

        mensajeHTML = `<strong>Información específica sobre Linfoma no hodgkin T:</strong><br>
                        Cariotipo.`;

    } else if (estudio === "Síndrome de VEXAS") {

        mensajeHTML = `<strong>Información específica sobre Síndrome de VEXAS:</strong><br>
                        Mutaciones UBA1.`;

    } else if (estudio === "Hemofilia y Von Willebrand") {

        mensajeHTML = `<strong>Información específica sobre Hemofilia y Von Willebrand:</strong><br>
                        Panel de NGS de hemofilia y FVW.`;

    } else {

        mensajeHTML = "Opción no reconocida.";

    }
    
    const div = document.createElement('div');
    div.className = 'estudio-item';
    div.innerHTML = mensajeHTML;
    textoSeleccionado.appendChild(div);
}
// mostrarInformacionEstudios(estudios) no se usa!!
function mostrarInformacionEstudios(estudios) {
    const textoSeleccionado = document.getElementById('textoSeleccionado');

    const checkboxEstados = {};
    const checkboxesActuales = textoSeleccionado.querySelectorAll('input[type="checkbox"]');
    checkboxesActuales.forEach(checkbox => {
        checkboxEstados[checkbox.id] = checkbox.checked;
    });

    textoSeleccionado.innerHTML = ''; // Limpiar contenido anterior
    
    estudios.forEach((estudio, index) => {
        const div = document.createElement('div');
        div.className = 'estudio-item';
        div.style.whiteSpace = 'normal';
        div.style.wordWrap = 'break-word';
        div.style.overflowWrap = 'break-word';
        div.style.maxWidth = '100%';
        
        let mensajeHTML = '';
        
        if (estudio === "Leucemia aguda mieloblástica") {
            
            mensajeHTML = `<strong>Información específica sobre Leucemia aguda mieloblástica:</strong><br>
                            Cariotipo.<br>
                            FISH: 5q, 7q, C-8, KMT2A (MLL).<br>
                            Traslocaciones por qRT-PCR:<br>
                            <ul>
                                <li>t(15;17) – PML::RARA</li>
                                <li>t(8;21) – RUNX1::RUNX1T1</li>
                                <li>inv(16) – CBFB::MYH11</li>
                            </ul>
                            Mutaciones de NPM1, FLT3 y IDH1/2.<br>
                            Expresión WT1. Panel NGS mieloide: si candidato a TPH o si está incluido en la PLATAFO-LMA.<br>
                            <strong>Nota:</strong> En caso de sospecha morfológica y que se precise conocer el resultado en 24-48h se podrían solicitar los estudios de FISH de t(15;17) o t(8;21) o inv(16).`;

        } else if (estudio === "Leucemia aguda linfoblástica") {

            mensajeHTML = `<strong>Información específica sobre Leucemia aguda linfoblástica:</strong><br>
                            Cariotipo.<br>
                            B: Traslocaciones por FISH:<ul>
                                <li>t(9;22)</li>
                                <li>KMT2A (MLL)</li>
                                <li>t(1;19)</li>
                                <li>t(12;21)</li>
                                <li>qRT-PCR si positivo por FISH:<ul>
                                    <li>t(9;22) – BCR::ABL</li>
                                    <li>t(1;19) – TCF3::PBX1</li>
                                    <li>t(4;11) – KMT2A::AF4</li>
                                    <li>t(12;21) – ETV6::RUNX1</li>
                                </ul></li>
                            </ul>
                            T: SIL::TAL por qRT-PCR.`;

        } else if (estudio === "Síndrome mielodisplásico") {
            mensajeHTML = `<strong>Información específica sobre Síndrome mielodisplásico:</strong><br>
                            Cariotipo.<br>
                            FISH: 5q, 7q, C-8 y 20q.<br>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="sindromeMielodisplasicoOpciones" id="sindromeMielodisplasico1">
                                <label class="form-check-label" for="sindromeMielodisplasico1">Si candidato a ALO-TPH o si está incluido en estudio UMBRELLA: Panel de NGS mieloide</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="sindromeMielodisplasicoOpciones" id="sindromeMielodisplasico2">
                                <label class="form-check-label" for="sindromeMielodisplasico2">Si trombocitosis/fibrosis medular: Mutación de JAK2</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="sindromeMielodisplasicoOpciones" id="sindromeMielodisplasico3">
                                <label class="form-check-label" for="sindromeMielodisplasico3">Si eosinofilia: FISH de PDGFRA, PDGFRB, FGFR1, JAK2</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="sindromeMielodisplasicoOpciones" id="sindromeMielodisplasico4">
                                <label class="form-check-label" for="sindromeMielodisplasico4">Si SMD con del(5q): Mutaciones de TP53</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="sindromeMielodisplasicoOpciones" id="sindromeMielodisplasico5">
                                <label class="form-check-label" for="sindromeMielodisplasico5">Si bajo % de blastos: Mutaciones de SF3B1</label>
                            </div>
                            <div id="notaSindromeMielodisplasico">
                                Nota: Si al diagnóstico no se conoce esta información, se debe notificar vía mail posteriormente.
                            </div>`;
            
        } else if (estudio === "Leucemia mielomonocítica crónica") {

            mensajeHTML = `<strong>Información específica sobre Leucemia mielomonocítica crónica:</strong><br>
                            Cariotipo.<br>
                            FISH: 5q, 7q, C-8, 20q.<br>
                            Panel de NGS mieloide en pacientes candidatos a aloTPH.`;

        } else if (estudio === "Neoplasias mieloproliferativas crónicas no LMC") {

            mensajeHTML = `<strong>Información específica sobre Neoplasias mieloproliferativas crónicas no LMC:</strong><br>
                            Cariotipo.<br>
                            FISH: t(9;22).<br>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="mieloproliferativasOpciones" id="mieloproliferativas1">
                                <label class="form-check-label" for="mieloproliferativas1">Poliglobulia: Mutaciones de JAK2</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="mieloproliferativasOpciones" id="mieloproliferativas2">
                                <label class="form-check-label" for="mieloproliferativas2">Trombocitosis: Mutaciones de JAK2, CALR y MPL</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="mieloproliferativasOpciones" id="mieloproliferativas3">
                                <label class="form-check-label" for="mieloproliferativas3">Mielofibrosis: Mutaciones de JAK2, CALR y MPL</label>
                            </div>`;

        } else if (estudio === "Trombosis de territorios esplácnicos") {

            mensajeHTML = `<strong>Información específica sobre Trombosis de territorios esplácnicos:</strong><br>
                            Mutaciones de JAK2.`;

        } else if (estudio === "Leucemia mieloide crónica") {

            mensajeHTML = `<strong>Información específica sobre Leucemia mieloide crónica:</strong><br>
                            FISH: t(9;22).<br>
                            qRT-PCR: t(9;22) – BCR::ABL.<br>
                            Seguimiento: qRT-PCR de t(9;22) - BCR::ABL.`;

        } else if (estudio === "Eosinofilia") {
            
            mensajeHTML = `<strong>Información específica sobre Eosinofilia:</strong><br>
                            Cariotipo.<br>
                            FISH de PDGFRA y PDGFRB.`;

        } else if (estudio === "Leucemia neutrofílica crónica") {

            mensajeHTML = `<strong>Información específica sobre Leucemia neutrofílica crónica:</strong><br>
                            Mutaciones de CSF3R.`;

        } else if (estudio === "Mastocitosis") {

            mensajeHTML = `<strong>Información específica sobre Mastocitosis:</strong><br>
                            Cariotipo.<br>
                            Mutación de KIT.`;

        } else if (estudio === "Aplasia medular") {

            mensajeHTML = `<strong>Información específica sobre Aplasia medular:</strong><br>
                            Cariotipo en médula ósea.<br>
                            Fragilidad cromosómica en sangre periférica.`;

        } else if (estudio === "Citopenias aisladas") {

            mensajeHTML = `<strong>Información específica sobre Citopenias aisladas:</strong><br>
                            Cariotipo.<br>
                            Se guarda ADN hasta concretar diagnóstico.`;

        } else if (estudio === "Leucemia linfática crónica") {

            mensajeHTML = `<strong>Información específica sobre Leucemia linfática crónica:</strong><br>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc1">
                                <label class="form-check-label" for="llc1">Al diagnóstico: Cariotipo. Mutaciones de IGHV</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc2">
                                <label class="form-check-label" for="llc2">Antes de tratamiento/recaída: Cariotipo. FISH: C-12, 14q, 13q, 11q (ATM), 17p(TP53). Mutaciones TP53.</label>
                            </div>`;

        } else if (estudio === "Tricoleucemia") {

            mensajeHTML = `<strong>Información específica sobre Tricoleucemia:</strong><br>
                            Mutaciones de BRAF.`;

        } else if (estudio === "Sospecha de síndrome linfoproliferativo") {

            mensajeHTML = `<strong>Información específica sobre Sospecha de síndrome linfoproliferativo:</strong><br>
                            Se guardará ADN y células fijadas hasta definir el diagnóstico.`;

        } else if (estudio === "Linfoma de células B grandes difuso") {

            mensajeHTML = `<strong>Información específica sobre Linfoma de células B grandes difuso:</strong><br>
                            <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                                Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                                Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                            </div>
                            Cariotipo. FISH: BCL2, BCL6, MYC y TP53.`;

        } else if (estudio === "Linfoma folicular") {

            mensajeHTML = `<strong>Información específica sobre Linfoma folicular:</strong><br>
                            <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                                Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                                Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                            </div>
                            Cariotipo. FISH: t(14;18).`;

        } else if (estudio === "Linfoma de células del manto") {

            mensajeHTML = `<strong>Información específica sobre Linfoma de células del manto:</strong><br>
                            <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                                Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                                Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                            </div>
                            Cariotipo. FISH: t(11;14) y del(17p).<br>
                            Mutaciones de TP53.`;

        } else if (estudio === "Mieloma Múltiple") {

            mensajeHTML = `<strong>Información específica sobre Mieloma Múltiple:</strong><br>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="mielomaOpciones" id="mieloma1">
                                <label class="form-check-label" for="mieloma1">FISH: t(4;14), t(14;16), t(14;20), 1q/1p y 17p.</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="mielomaOpciones" id="mieloma2">
                                <label class="form-check-label" for="mieloma2">Mutaciones TP53.</label>
                            </div>`;

        } else if (estudio === "Macroglobulinemia de Waldestrom") {

            mensajeHTML = `<strong>Información específica sobre Macroglobulinemia de Waldestrom:</strong><br>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="waldestromOpciones" id="waldestrom1">
                                <label class="form-check-label" for="waldestrom1">FISH: del(6q), C-4, del(17p).</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="waldestromOpciones" id="waldestrom2">
                                <label class="form-check-label" for="waldestrom2">Mutaciones de MYD88 y CXCR4.</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="waldestromOpciones" id="waldestrom3">
                                <label class="form-check-label" for="waldestrom3">Antes de tratamiento/recaída: Mutaciones de TP53.</label>
                            </div>`;

        } else if (estudio === "Leucemia de linfocitos grandes granulares") {

            mensajeHTML = `<strong>Información específica sobre Leucemia de linfocitos grandes granulares:</strong><br>
                            Cariotipo.`;

        } else if (estudio === "Linfoma no hodgkin T") {

            mensajeHTML = `<strong>Información específica sobre Linfoma no hodgkin T:</strong><br>
                            Cariotipo.`;

        } else if (estudio === "Síndrome de VEXAS") {

            mensajeHTML = `<strong>Información específica sobre Síndrome de VEXAS:</strong><br>
                            Mutaciones UBA1.`;

        } else if (estudio === "Hemofilia y Von Willebrand") {

            mensajeHTML = `<strong>Información específica sobre Hemofilia y Von Willebrand:</strong><br>
                            Panel de NGS de hemofilia y FVW.`;

        } else {

            mensajeHTML = "Opción no reconocida.";

        }
        
        div.innerHTML = mensajeHTML;
        textoSeleccionado.appendChild(div);

        // Esperar a que el DOM se actualice
        setTimeout(() => {
            const checkbox2 = document.getElementById('sindromeMielodisplasico2');
            const checkbox4 = document.getElementById('sindromeMielodisplasico4');
            const checkbox5 = document.getElementById('sindromeMielodisplasico5');
            const nota = document.getElementById('notaSindromeMielodisplasico');

            if (nota) {
                nota.style.display = 'none'; // Inicialmente oculta
            }

            function actualizarNota() {
                if (nota) {
                    const mostrar = (checkbox2 && checkbox2.checked) || 
                                  (checkbox4 && checkbox4.checked) || 
                                  (checkbox5 && checkbox5.checked);
                    nota.style.display = mostrar ? 'block' : 'none';
                }
            }

            // Agregar event listeners
            if (checkbox2) checkbox2.addEventListener('change', actualizarNota);
            if (checkbox4) checkbox4.addEventListener('change', actualizarNota);
            if (checkbox5) checkbox5.addEventListener('change', actualizarNota);
            
            // Actualizar estado inicial
            actualizarNota();
        }, 100);
    });

        for (let id in checkboxEstados) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = checkboxEstados[id];
        }
    }

}

// MOSTRAR INPUTS PEQUEÑOS DIAGNOSTICOS

const radioConfirmado = document.getElementById('diagnosticoConfirmado');
const radioSospecha = document.getElementById('diagnosticoSospecha');
const contenedorInputs = document.getElementById('inputsDiagnostico');

function mostrarInputs() {

    if (radioSospecha.checked) {
        contenedorInputs.innerHTML = `
        <div class="row align-items-center">

            <div class="col-sm-1 my-1">
                
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Hb</div>
                    </div>
                    <input type="text" class="form-control" id="inputHb" placeholder="00">
                </div>
            </div>
            <div class="col-sm-2 my-1">
                
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Leucocitos</div>
                    </div>
                    <input type="text" class="form-control" id="Leucocitos" placeholder="00">
                </div>
            </div>

            <div class="col-sm-2 my-1">
                <div class="input-group">
                    <div class="input-group-prepend">
                    <div class="input-group-text">Neu/Linf</div>
                    </div>
                    <input type="text" class="form-control" id="N_L" placeholder="00">
                </div>
            </div>
            
            <div class="col-sm-3 my-1">
                <div class="input-group">
                    <div class="input-group-prepend">
                    <div class="input-group-text">Plaquetas</div>
                    </div>
                    <input type="text" class="form-control" id="Plaquetas" placeholder="00">
                </div>
            </div>
            

            <div class="col-sm-2 my-1">
                <div class="input-group">
                    <div class="input-group-prepend">
                    <div class="input-group-text">Blastos</div>
                    </div>
                    <input type="text" class="form-control" id="Blastos" placeholder="00">
                </div>
            </div>

            
        </div>
        `;
    } else {
        contenedorInputs.innerHTML = '';  // Ocultar inputs si no está confirmado
    }
}
radioConfirmado.addEventListener('change', mostrarInputs);
radioSospecha.addEventListener('change', mostrarInputs);

function guardarOpcion(opcion, event) {
    event.preventDefault();
    document.getElementById('tratamientoSeleccionado').value = opcion;
    document.getElementById('tratamiento').textContent = 'CANDIDATO A TRATAMIENTO INTENSIVO: ' + opcion;
}

function guardarOpcionEnsayo(opcion, event) {
    event.preventDefault();
    document.getElementById('ensayoSeleccionado').value = opcion;
    document.getElementById('ensayo').textContent = 'ENSAYO CLÍNICO/PROTOCOLO: ' + opcion;
    
    const detallesDiv = document.getElementById('ensayoClinicoDetalles');
    if (opcion === 'Si') {
        detallesDiv.style.display = 'block';
    } else {
        detallesDiv.style.display = 'none';
    }
}

function guardarMomentoEvolutivo() {
    document.getElementById('errorMensaje').style.display = 'none';
}

function guardarTipoMuestra() {
    document.getElementById('errorMensajeMuestra').style.display = 'none';
}

function mostrarCampoTexto() {
    document.querySelector('.inputMuestra').style.display = 'block';
}

function mostrarCampoTextoMomento() {
    document.querySelector('.otrosInput').style.display = 'block';
}

// Función para actualizar el contenido al imprimir
// function actualizarSexoSeleccionado() {
//     const masculino = document.getElementById("checkboxMasculino").checked;
//     const femenino = document.getElementById("checkboxFemenino").checked;
//     let seleccion = "";

//     if (masculino) {
//         seleccion += "Hombre";
//     }
//     if (femenino) {
//         seleccion += "Mujer";
//     }

//     // Mostrar la selección al usuario para impresión
//     const mostrarSeleccion = document.getElementById("sexoSeleccionado");
    
//     if (masculino || femenino) {
//         mostrarSeleccion.innerHTML = seleccion;
//     } else {
//         mostrarSeleccion.innerHTML = "";
//     }
// }

function mostrarCampoTextoEMR() {
    const emrMarkerDiv = document.getElementById('emrMarker');
    // Validación general
    const emrRadio = document.getElementById('emr');
    
    if (emrRadio.checked) {
        emrMarkerDiv.style.display = 'block';
        document.getElementById('marcadorMolecular').focus();
    } else {
        emrMarkerDiv.style.display = 'none';
    }
}

function validarFormulario() {
    let formularioValido = true;

    // Elimina los mensajes de error
    if (errorDiagnostico) errorDiagnostico.remove();
    if (errorMedico) errorMedico.remove();
    if (errorEmail) errorEmail.remove();
    if (errorHospital) errorHospital.remove();
    if (errorTratamiento) errorTratamiento.remove();
    if (errorInput) errorInput.remove();
    if (errorEnsayo) errorEnsayo.remove();
    if (errorTipoMuestra) errorTipoMuestra.remove();
    if (errorSospechaDiagnostico) errorSospechaDiagnostico.remove();

    // VALIDAR DIAGNÓSTICO
    const diagnosticoConfirmado = document.getElementById("diagnosticoConfirmado").checked;
    const diagnosticoSospecha = document.getElementById("diagnosticoSospecha").checked;
    const diagnosticoTexto = document.getElementById("diagnosticoTexto").value.trim();

    if ((!diagnosticoConfirmado && !diagnosticoSospecha) || !diagnosticoTexto) {
        formularioValido = false;
        
        errorDiagnostico = document.createElement("span");
        errorDiagnostico.style.color = "red";
        errorDiagnostico.style.fontSize = "13px";
        errorDiagnostico.textContent = "Debe seleccionar un tipo de diagnóstico y especificarlo";
        document.getElementById("diagnosticoTexto").parentElement.appendChild(errorDiagnostico);
    }

    // VALIDAR MEDICO
    const medico = document.getElementById("medico").value.trim();
    if (!medico) {
        formularioValido = false;
        errorMedico = document.createElement("span");
        errorMedico.style.color = "red";
        errorMedico.style.fontSize = "13px";
        errorMedico.textContent = "El médico no puede estar vacío";
        document.getElementById("medico").parentElement.appendChild(errorMedico);
    }

    // VALIDAR EMAIL
    const email = document.getElementById("email").value.trim();
    if (!email) {
        formularioValido = false;
        errorEmail = document.createElement("span");
        errorEmail.style.color = "red";
        errorEmail.style.fontSize = "13px";
        errorEmail.textContent = "El email no puede estar vacío";
        document.getElementById("email").parentElement.appendChild(errorEmail);
    }

    // VALIDAR HOSPITAL
    const hospital = document.getElementById("hospital").value.trim();
    if (!hospital) {
        formularioValido = false;
        errorHospital = document.createElement("span");
        errorHospital.style.color = "red";
        errorHospital.style.fontSize = "13px";
        errorHospital.textContent = "El hospital no puede estar vacío";
        document.getElementById("hospital").parentElement.appendChild(errorHospital);
    }

    // VALIDAR TIPO DE MUESTRA
    const checkboxesMuestra = document.querySelectorAll('input[name="tipoMuestra"]');
    let seleccionadoMuestra = false;

    checkboxesMuestra.forEach(function (checkbox) {
        if (checkbox.checked) {
            seleccionadoMuestra = true;
        }
    });

    if (!seleccionadoMuestra) {
        formularioValido = false;
        errorTipoMuestra = document.createElement("span");
        errorTipoMuestra.style.color = "red";
        errorTipoMuestra.style.fontSize = "13px";
        errorTipoMuestra.textContent = "Debe seleccionar al menos un tipo de muestra";
        document.querySelector('.labelTipoMuestra').appendChild(errorTipoMuestra);
    }

    // VALIDAR TRATAMIENTO
    const tratamiento = document.getElementById("tratamientoSeleccionado").value;
    if (!tratamiento) {
        formularioValido = false;
        errorTratamiento = document.createElement("span");
        errorTratamiento.style.color = "red";
        errorTratamiento.style.fontSize = "13px";
        errorTratamiento.textContent = "Debe seleccionar si es candidato a tratamiento intensivo";
        document.getElementById("tratamiento").parentElement.appendChild(errorTratamiento);
    }

    // VALIDAR MOMENTO EVOLUTIVO
    const momentoEvolutivo = document.querySelector('input[name="momentoEvolutivo"]:checked');
    if (!momentoEvolutivo) {
        formularioValido = false;
        const errorMensaje = document.getElementById("errorMensaje");
        errorMensaje.style.display = "block";
    } else {
        const errorMensaje = document.getElementById("errorMensaje");
        errorMensaje.style.display = "none";
    }

    // VALIDAR "OTROS" EN MOMENTO EVOLUTIVO
    const otrosEvolutivos = document.getElementById("otrosEvolutivos");
    const otrosInputEvolutivo = document.getElementById("otrosInputEvolutivo");
    if (otrosEvolutivos && otrosEvolutivos.checked && !otrosInputEvolutivo.value.trim()) {
        formularioValido = false;
        errorInput = document.createElement("span");
        errorInput.style.color = "red";
        errorInput.style.fontSize = "13px";
        errorInput.textContent = "Debe especificar el momento evolutivo";
        otrosInputEvolutivo.parentElement.appendChild(errorInput);
    }

    // VALIDAR ENSAYO CLÍNICO
    const ensayoSeleccionado = document.getElementById("ensayoSeleccionado").value;
    const ensayoClinicoTexto = document.getElementById("ensayoClinicoTexto").value.trim();
    
    if (ensayoSeleccionado === "Si" && !ensayoClinicoTexto) {
        formularioValido = false;
        errorEnsayo = document.createElement("span");
        errorEnsayo.style.color = "red";
        errorEnsayo.style.fontSize = "13px";
        errorEnsayo.textContent = "Debe especificar el ensayo clínico o protocolo";
        document.getElementById("ensayoClinicoTexto").parentElement.appendChild(errorEnsayo);
    }

    // VALIDAR JUSTIFICACIÓN DE OTROS ESTUDIOS
    const otrosEstudiosCheckboxes = document.querySelectorAll('input[name="otrosEstudios"]:checked');
    const justificacionTexto = document.getElementById("justificacionOtrosEstudiosTexto").value.trim();
    
    if (otrosEstudiosCheckboxes.length > 0 && !justificacionTexto) {
        formularioValido = false;
        const errorJustificacion = document.createElement("span");
        errorJustificacion.style.color = "red";
        errorJustificacion.style.fontSize = "13px";
        errorJustificacion.textContent = "Debe especificar la justificación de los estudios seleccionados";
        document.getElementById("justificacionOtrosEstudiosTexto").parentElement.appendChild(errorJustificacion);
    }

    return formularioValido;
}

document.addEventListener('DOMContentLoaded', function() {
    const radioButtons = document.querySelectorAll('input[name="momentoEvolutivo"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.id === 'emr') {
                mostrarCampoTextoEMR();
            } else {
                const emrMarkerDiv = document.getElementById('emrMarker');
                emrMarkerDiv.style.display = 'none';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const otrosEstudiosCheckboxes = document.querySelectorAll('input[name="otrosEstudios"]');
    const justificacionDiv = document.getElementById('justificacionOtrosEstudios');
    
    otrosEstudiosCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const anyChecked = Array.from(otrosEstudiosCheckboxes).some(cb => cb.checked);
            justificacionDiv.style.display = anyChecked ? 'block' : 'none';
        });
    });

    // Handle myelodysplastic syndrome options
    const sindromeMielodisplasicoCheckboxes = document.querySelectorAll('input[name="sindromeMielodisplasicoOpciones"]');
    const notaSindromeMielodisplasico = document.getElementById('notaSindromeMielodisplasico');
    
    sindromeMielodisplasicoCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const optionsToCheck = ['sindromeMielodisplasico2', 'sindromeMielodisplasico4', 'sindromeMielodisplasico5'];
            const anyChecked = optionsToCheck.some(id => document.getElementById(id).checked);
            if (anyChecked) {
                notaSindromeMielodisplasico.style.display = 'block';
                notaSindromeMielodisplasico.textContent = 'Nota: Si al diagnóstico no se conoce esta información, se debe notificar vía mail posteriormente.';
            } else {
                notaSindromeMielodisplasico.style.display = 'none';
            }
        });
    });
});

// Función para actualizar la nota del síndrome mielodisplásico
function actualizarNotaMielodisplasico() {
    const checkbox2 = document.getElementById('sindromeMielodisplasico2');
    const checkbox4 = document.getElementById('sindromeMielodisplasico4');
    const checkbox5 = document.getElementById('sindromeMielodisplasico5');
    const nota = document.getElementById('notaSindromeMielodisplasico');
    
    if (checkbox2 && checkbox4 && checkbox5 && nota) {
        const mostrar = checkbox2.checked || checkbox4.checked || checkbox5.checked;
        nota.style.display = mostrar ? 'block' : 'none';
    }
}

// Event listeners para los checkboxes del síndrome mielodisplásico
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = ['sindromeMielodisplasico2', 'sindromeMielodisplasico4', 'sindromeMielodisplasico5'];
    
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', actualizarNotaMielodisplasico);
        }
    });
});
