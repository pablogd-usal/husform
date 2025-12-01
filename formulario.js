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
            errorGeneral.textContent = "Faltan campos por completar";
            
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

            // Ventana emergente antes de imprimir
            const confirmar = alert(
                "En las muestras de MO se enviará un tubo de EDTA y un tubo de heparina (sódica o litio)"
            );

            window.print();
        }
    });

    //Ordenar alfabéticamente los estudios protocolizados en el dropdown
    const menuEstudios = document.querySelector('.colEstudiosProtocolizados .dropdown-menu');
    if (menuEstudios) {
        const items = Array.from(menuEstudios.querySelectorAll('.dropdown-item'));

        items
          .sort((a, b) =>
            a.textContent.trim().localeCompare(
              b.textContent.trim(),
              'es',
              { sensitivity: 'base' }
            )
          )
          .forEach(item => menuEstudios.appendChild(item)); // reinsertar en orden
    }


    const inpNombre = document.getElementById('nombreApellidos');
    const vistaNombre = document.getElementById('vistaNombre');
    if (inpNombre && vistaNombre) {
    const syncNombre = () => { vistaNombre.textContent = inpNombre.value || ""; };
    inpNombre.addEventListener('input', syncNombre);
    syncNombre(); // estado inicial
    }

    const inpSolic = document.getElementById('medico');
    const vistaSolic = document.getElementById('vistaSolicitante');
    if (inpSolic && vistaSolic) {
        const sync = () => { vistaSolic.textContent = inpSolic.value || ""; };
        inpSolic.addEventListener('input', sync);
        sync();
    }

    const inpHosp = document.getElementById('hospital');
    const vistaHosp = document.getElementById('vistaHospital');
    if (inpHosp && vistaHosp) {
        const sync = () => { vistaHosp.textContent = inpHosp.value || ""; };
        inpHosp.addEventListener('input', sync);
        sync();
    }

    const inpEmail = document.getElementById('email');
    const vistaEmail = document.getElementById('vistaEmail');
    if (inpEmail && vistaEmail) {
        const sync = () => { vistaEmail.textContent = inpEmail.value || ""; };
        inpEmail.addEventListener('input', sync);
        sync();
    }

    const inpTel = document.getElementById('telefono');
    const vistaTel = document.getElementById('vistaTelefono');
    if (inpTel && vistaTel) {
        const sync = () => { vistaTel.textContent = inpTel.value || ""; };
        inpTel.addEventListener('input', sync);
        sync();
    }

    // Event listeners para los checkboxes de sexo
    // document.getElementById("checkboxMasculino").addEventListener("change", actualizarSexoSeleccionado);
    // document.getElementById("checkboxFemenino").addEventListener("change", actualizarSexoSeleccionado);

    // Event listeners para los radio buttons de momento evolutivo
    const radioButtons = document.querySelectorAll('input[name="momentoEvolutivo"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const otrosInputDiv = document.querySelector('.otrosInput');
            const emrMarkerDiv = document.getElementById('emrMarker');
            const postTxDiv = document.getElementById('postTxDiasDiv');
            const postTxInput = document.getElementById('postTxDias');
            const otrosInputEvolutivo = document.getElementById('otrosInputEvolutivo');
            const marcadorMolecular = document.getElementById('marcadorMolecular');

            // reset de visibilidad
            otrosInputDiv.style.display = 'none';
            emrMarkerDiv.style.display = 'none';
            postTxDiv.style.display = 'none';

            // reset de required + vaciado de campos
            if (postTxInput) {
                postTxInput.required = false;
                postTxInput.value = '';
            }
            if (otrosInputEvolutivo) {
                otrosInputEvolutivo.value = '';
            }
            if (marcadorMolecular) {
                marcadorMolecular.value = '';
            }

            if (this.id === 'emr') {
                mostrarCampoTextoEMR();
            } else if (this.id === 'otrosEvolutivos') {
                otrosInputDiv.style.display = 'block';
                otrosInputEvolutivo?.focus();
            } else if (this.id === 'postransplante') {
                postTxDiv.style.display = 'block';
                if (postTxInput) {
                    postTxInput.required = true;
                    postTxInput.focus();
                }
            }
        });

        document.getElementById('postTxDias')?.addEventListener('input', () => {
            const old = document.getElementById('err-posttx');
            if (old) old.remove();
        });
    });


    // hemograma
    ['hbValor','leucocitosValor','neulinfValor','plaquetasValor','blastosValor'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('input', () => removeError(`err-hemo-${id}`));
    });

    // EMR marcador
    document.getElementById('marcadorMolecular')?.addEventListener('input', () => removeError('err-emr-marker'));


    // mostrar/ocultar estudios protocolizados según momento evolutivo
    function actualizarVisibilidadProtocolizados() {
    const seleccionado = document.querySelector('input[name="momentoEvolutivo"]:checked')?.id || '';
    const permite = (seleccionado === 'diagnostico' || seleccionado === 'recaidaProgresion');

    const colProtocolizados = document.querySelector('.colEstudiosProtocolizados'); // columna izq.
    const detalles = document.getElementById('textoSeleccionado');                  // panel detalle
    const boton = document.getElementById('dropdownEstudios');
    const input = document.getElementById('estudiosSeleccionados');
    const hiddenSubtipo = document.getElementById('subtipoLLASeleccionado');

    if (!colProtocolizados) return;

        if (permite) {
            // mostrar la columna de estudios protocolizados
            colProtocolizados.style.display = '';

            // si ya hay estudios seleccionados volver a pintar sus descripciones
            const dropdownItems = document.querySelectorAll('.colEstudiosProtocolizados .dropdown-menu .dropdown-item');

            if (dropdownItems.length && detalles && boton && input) {
                let selectedItems = Array.from(dropdownItems)
                    .filter(item => item.classList.contains('selected'))
                    .map(item => item.textContent.trim());

                if (selectedItems.length > 0) {
                    selectedItems.sort((a, b) =>
                    a.localeCompare(b, 'es', { sensitivity: 'base' })
                    );

                    // actualizar texto del boton y el hidden
                    boton.textContent = 'ESTUDIOS PROTOCOLIZADOS ' + selectedItems.join(', ');
                    input.value = selectedItems.join(',');

                    // volver a generar las descripciones con el momento evolutivo actual
                    mostrarInformacionEstudios(selectedItems);
                }
            }

        } else {
            // ocultar y limpiar estado
            colProtocolizados.style.display = 'none';
            if (detalles) detalles.innerHTML = '';
            if (boton) boton.textContent = 'ESTUDIOS PROTOCOLIZADOS';
            if (input) input.value = '';
            if (hiddenSubtipo) hiddenSubtipo.value = '';

            // quitar selección visual del dropdown
            document.querySelectorAll('.dropdown-menu .dropdown-item.selected')
            .forEach(it => it.classList.remove('selected'));
        }

    }

    // engancha al cambio de momento evolutivo
    document.querySelectorAll('input[name="momentoEvolutivo"]').forEach(r => {
    r.addEventListener('change', actualizarVisibilidadProtocolizados);
    });

    // estado inicial
    actualizarVisibilidadProtocolizados();


    // Event listeners para los radio buttons de tipo de muestra
    /*const tipoMuestraRadios = document.querySelectorAll('input[name="tipoMuestra"]');
    tipoMuestraRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const inputMuestraDiv = document.querySelector('.inputMuestra');
            if (this.id === 'otrosTejidos' || this.id === 'liquido' || this.id === 'otrasMuestras') {
                inputMuestraDiv.style.display = 'block';
                document.getElementById('otrosInputMuestra').focus();
            } else {
                inputMuestraDiv.style.display = 'none';
            }
        });
    });*/
    const checkboxOtras = document.getElementById('otrasMuestras');
    const inputMuestraDiv = document.querySelector('.inputMuestra');
    const otrosInput = document.getElementById('otrosInputMuestra');

    if (checkboxOtras && inputMuestraDiv) {
        checkboxOtras.addEventListener('change', () => {
            const mostrar = checkboxOtras.checked;
            inputMuestraDiv.style.display = mostrar ? 'block' : 'none';

            if (mostrar) {
                otrosInput.required = true;
                otrosInput.focus();
            } else {
                otrosInput.required = false;
                otrosInput.value = '';// limpiar texto
                removeError('err-otros-muestra');
            }
        });
    }


    const bloqueInfiltracion = document.getElementById('bloqueInfiltracion');
    if (!bloqueInfiltracion) return; 

    // Primero checkboxes dentro de #tipoMuestra, si no, por name
    let checkboxesMuestra = document.querySelectorAll('#tipoMuestra input[type="checkbox"]');
    if (!checkboxesMuestra.length) {
        checkboxesMuestra = document.querySelectorAll('input[type="checkbox"][name="tipoMuestra"]');
    }

    function actualizarInfiltracion() {
        const seleccionadas = Array.from(checkboxesMuestra)
            .filter(ch => ch.checked)
            .map(ch => (ch.value || ch.id || '').toUpperCase().trim());

        const mostrar = seleccionadas.includes('SP') || seleccionadas.includes('MO');

        bloqueInfiltracion.classList.toggle('d-none', !mostrar);

        const input = document.getElementById('infiltracion');
        if (input) {
            input.required = false;
        }
    }


    checkboxesMuestra.forEach(ch => ch.addEventListener('change', actualizarInfiltracion));

    // Estado inicial forzado (evita que quede visible por CSS legacy)
    bloqueInfiltracion.classList.add('d-none');
    actualizarInfiltracion();


    // Event listeners para los checkboxes de otros estudios
    const otrosEstudiosCheckboxes = document.querySelectorAll('input[name="otrosEstudios"]');
    const justificacionDiv = document.getElementById('justificacionOtrosEstudios');

    otrosEstudiosCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const anyChecked = Array.from(otrosEstudiosCheckboxes).some(cb => cb.checked);
            justificacionDiv.style.display = anyChecked ? 'block' : 'none';

            // Si ya no hay ninguno marcado, limpiar el texto
            if (!anyChecked) {
                const justInput = document.getElementById('justificacionOtrosEstudiosTexto');
                const vistaJust = document.getElementById('vistaJustificacion');
                if (justInput) justInput.value = '';
                if (vistaJust) vistaJust.textContent = '';
            }
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

    document.addEventListener('DOMContentLoaded', () => {
    const checkboxLLA = document.getElementById('lla');
    const bloqueSubtipo = document.getElementById('subtipoLLA');

    if (checkboxLLA && bloqueSubtipo) {
        function actualizarSubtipoLLA() {
        bloqueSubtipo.style.display = checkboxLLA.checked ? 'block' : 'none';
        if (!checkboxLLA.checked) {
            // Desmarcar B/T si se desactiva la LLA principal
            document.querySelectorAll('input[name="subtipoLLA"]').forEach(r => r.checked = false);
        }
        }

        checkboxLLA.addEventListener('change', actualizarSubtipoLLA);
        actualizarSubtipoLLA(); // inicializa al cargar
    }
    });


    // Inicializar el estado del sexo
    // actualizarSexoSeleccionado();
});

// Variables para almacenar errores y evitar duplicados
let errorDiagnostico, errorMedico, errorEmail, errorTelefono, errorHospital, errorTratamiento, errorInput, errorEnsayo, errorTipoMuestra, errorSospechaDiagnostico, errorLabDecision;

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
  } else if (momentoEvolutivo === 'postransplante') {
    const dias = (document.getElementById('postTxDias')?.value || '').trim();
    momentoEvolutivo = dias ? `Postrasplante: ${dias} días` : 'Postrasplante';
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
    const hiddenSubtipo = document.getElementById('subtipoLLASeleccionado');
    if (hiddenSubtipo && !selectedItems.includes('Leucemia linfoblástica aguda')) {
    hiddenSubtipo.value = '';
    }


    // Actualizar el texto del botón y el valor del input
    const button = document.getElementById('dropdownEstudios');
    const input = document.getElementById('estudiosSeleccionados');

    //# button.textContent = 'ESTUDIOS PROTOCOLIZADOS: ' + (clickedItem ? clickedItem.textContent.trim() : '');
    //# console.log("------->:", selectedItems, selectedItem, clickedItem);
    //# mostrarInformacionEstudio(clickedItem ? clickedItem.textContent.trim() : '');

    if (selectedItems.length > 0) {
        let buttonText = 'ESTUDIOS PROTOCOLIZADOS ' + selectedItems.join(', ');
        button.textContent = buttonText;
        input.value = selectedItems.join(',');

        // Mostrar la información de los estudios
        mostrarInformacionEstudios(selectedItems);
    } else {
        button.textContent = 'ESTUDIOS PROTOCOLIZADOS';
        input.value = '';
        const textoSeleccionado = document.getElementById('textoSeleccionado');
        textoSeleccionado.textContent = 'Selecciona una opción para ver los detalles.';
    }
}

//Cursiva automática de genes
function italicizeGenes(html) {
  // Lista de genes/marcadores que aparecen en tus textos
  const GENES = [
    "KMT2A","MLL","PML","RARA","RUNX1","RUNX1T1","CBFB","MYH11",
    "NPM1","FLT3","IDH1","IDH2","WT1","BCR","ABL","TCF3","PBX1",
    "AF4","ETV6","PDGFRA","PDGFRB","FGFR1","JAK2","CALR","MPL",
    "CSF3R","KIT","BRAF","IGHV","BCL2","BCL6","MYC","TP53","SF3B1",
    "UBA1","SIL", "TAL", "MYD88", "CXCR4", "ATM"
  ];

  // 1) Protege lo que ya esté en <em>...</em> para no re-envolver
  const saved = {};
  let i = 0;
  html = html.replace(/<em>.*?<\/em>/g, m => {
    const key = `__EM_SAVE_${i++}__`;
    saved[key] = m;
    return key;
  });

  // 2) Envolver coincidencias con <em>...>
  // Ordena por longitud desc para evitar que RUNX1 se coma RUNX1T1
  const pattern = new RegExp(
    "\\b(" + GENES.sort((a,b)=>b.length-a.length).map(g=>g.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\b",
    "g"
  );
  html = html.replace(pattern, "<em>$1</em>");

  // 3) Restaura lo que ya estaba en <em>
  Object.keys(saved).forEach(k => { html = html.replaceAll(k, saved[k]); });

  return html;
}

function mostrarInformacionEstudio(estudio) {
    const textoSeleccionado = document.getElementById('textoSeleccionado');
    textoSeleccionado.innerHTML = ''; // Limpiar contenido anterior

    let mensajeHTML = '';
        
    if (estudio === "Leucemia mieloblástica aguda") {

       if (esRecaida) {
                // Versión para recaída/progresión 
                mensajeHTML = `
                    <strong>Información específica sobre Leucemia mieloblástica aguda – Seleccione rango de edad:</strong><br><br>

                    <div class="row mb-2">
                        <div class="col-6">
                            Cariotipo<br>
                            FISH: 5q, 7q, C-8, KMT2A (MLL).
                        </div>
                        <div class="col-6">
                            Traslocaciones por qRT-PCR: Si se detectó alguna al diagnóstico
                        </div>
                    </div>

                    <div class="mt-2 mb-2">
                        <label class="form-label d-block mb-1">Rango de edad:</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="lmaEdad" id="lmaMenor75" value="menor75">
                            <label class="form-check-label" for="lmaMenor75">Menor de 75 años</label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="lmaEdad" id="lma7585" value="75a85">
                            <label class="form-check-label" for="lma7585">75 a 85 años</label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="lmaEdad" id="lmaMas85" value="mas85">
                            <label class="form-check-label" for="lmaMas85">Mayor de 85 años</label>
                        </div>
                    </div>

                    <hr>

                    <!-- Contenido ≤75 años -->
                    <div id="lmaContMenor75" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-3">
                                Mutaciones de NPM1, FLT3 y IDH1/2.
                            </div>
                            <div class="col-3">
                                qRT-PCR: t(15;17), inv(16) y t(8;21) si han pasado más de 2 años desde el diagnóstico.
                            </div>
                            <div class="col-3">
                                Expresión WT1. Si han pasado más de 2 años desde el diagnóstico.
                            </div>
                            <div class="col-3">
                                Panel NGS mieloide
                            </div>
                        </div>
                    </div>

                    <!-- Contenido 75-85 -->
                    <div id="lmaCont7585" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-6">
                                Mutaciones de FLT3 y IDH1/2.
                            </div>
                            <div class="col-6">
                                Panel NGS mieloide
                            </div>
                        </div>
                    </div>

                    <!-- Contenido >85 -->
                    <div id="lmaContMas85" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-12">
                                Mutaciones de FLT3 y IDH1/2.
                            </div>
                        </div>
                    </div>
                `;

                // Activar el bloque correspondiente según el rango de edad elegido
                setTimeout(() => {
                    const r1 = document.getElementById("lmaMenor75");
                    const r2 = document.getElementById("lma7585");
                    const r3 = document.getElementById("lmaMas85");

                    const b1 = document.getElementById("lmaContMenor75");
                    const b2 = document.getElementById("lmaCont7585");
                    const b3 = document.getElementById("lmaContMas85");

                    function actualizar() {
                        b1.style.display = r1.checked ? "block" : "none";
                        b2.style.display = r2.checked ? "block" : "none";
                        b3.style.display = r3.checked ? "block" : "none";
                    }

                    if (r1) r1.addEventListener("change", actualizar);
                    if (r2) r2.addEventListener("change", actualizar);
                    if (r3) r3.addEventListener("change", actualizar);
                }, 50);

            } else {
                // Versión para diagnóstico
                mensajeHTML = `
                    <strong>Información específica sobre Leucemia mieloblástica aguda – Seleccione rango de edad:</strong><br><br>

                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="lmaEdad" id="lmaMenor75" value="menor75">
                        <label class="form-check-label" for="lmaMenor75">Menor de 75 años</label>
                    </div>

                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="lmaEdad" id="lma7585" value="75a85">
                        <label class="form-check-label" for="lma7585">75 a 85 años</label>
                    </div>

                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="lmaEdad" id="lmaMas85" value="mas85">
                        <label class="form-check-label" for="lmaMas85">Mayor de 85 años</label>
                    </div>

                    <hr>

                    <!-- Contenido Menor 75 -->
                    <div id="lmaContMenor75" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-3">
                                Cariotipo<br>
                                FISH: 5q, 7q, C-8, KMT2A (MLL)
                                <br>
                                Traslocaciones por qRT-PCR:
                                <br>
                                t(15;17) – PML::RARA
                                <br>
                                t(8;21) – RUNX1::RUNX1T1
                                <br>
                                inv(16) – CBFB::MYH11
                            </div>

                            <div class="col-3">
                                Mutaciones:
                                <br>
                                - NPM1
                                <br>
                                - FLT3
                                <br>
                                - IDH1/2
                            </div>

                            <div class="col-3">
                                Expresión WT1
                            </div>

                            <div class="col-3">
                                Panel NGS mieloide
                            </div>
                        </div>
                    </div>

                    <!-- Contenido 75-85 -->
                    <div id="lmaCont7585" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-4">
                                Cariotipo<br>
                                FISH: 5q, 7q, C-8, KMT2A (MLL)
                            </div>

                            <div class="col-4">
                                Mutaciones de IDH1/2
                            </div>

                            <div class="col-4">
                                Panel NGS mieloide
                            </div>
                        </div>
                    </div>

                    <!-- Contenido mayor 85 -->
                    <div id="lmaContMas85" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-6">
                                Cariotipo<br> 
                                FISH: 5q, 7q, C-8, KMT2A (MLL)
                            </div>

                            <div class="col-6">
                                Mutaciones de IDH1/2
                            </div>
                        </div>
                    </div>
                `;

                // Listeners para diagnóstico 
                setTimeout(() => {
                    const r1 = document.getElementById("lmaMenor75");
                    const r2 = document.getElementById("lma7585");
                    const r3 = document.getElementById("lmaMas85");

                    const b1 = document.getElementById("lmaContMenor75");
                    const b2 = document.getElementById("lmaCont7585");
                    const b3 = document.getElementById("lmaContMas85");

                    function actualizar() {
                        b1.style.display = r1.checked ? "block" : "none";
                        b2.style.display = r2.checked ? "block" : "none";
                        b3.style.display = r3.checked ? "block" : "none";
                    }

                    if (r1) r1.addEventListener("change", actualizar);
                    if (r2) r2.addEventListener("change", actualizar);
                    if (r3) r3.addEventListener("change", actualizar);
                }, 50);
            }
    } else if (estudio === "Leucemia linfoblástica aguda") {


        //const subtipoGuardado = document.getElementById('subtipoLLASeleccionado')?.value || '';

        // decide visibilidad inicial de los bloques según lo guardado
        const showB = subtipoGuardado === 'B';
        const showT = subtipoGuardado === 'T';

        mensajeHTML = `
            <strong>Información específica sobre Leucemia aguda linfoblástica:</strong><br>

            <div class="mt-2 mb-2">
            <label class="form-label d-block mb-1">Subtipo de LLA:</label>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="subtipoLLA" id="llaB" value="B" ${showB ? 'checked' : ''}>
                <label class="form-check-label" for="llaB">B</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="subtipoLLA" id="llaT" value="T" ${showT ? 'checked' : ''}>
                <label class="form-check-label" for="llaT">T</label>
            </div>
            </div>

            <!-- Contenido específico B -->
            <div id="llaContenidoB" style="display:${showB ? 'block' : 'none'}">
            Cariotipo<br>
            B: Traslocaciones por FISH:
            <ul>
                <li>t(9;22)</li>
                <li>KMT2A (MLL)</li>
                <li>t(1;19)</li>
                <li>t(12;21)</li>
                <li>qRT-PCR si positivo por FISH:
                <ul>
                    <li>t(9;22) – BCR::ABL</li>
                    <li>t(1;19) – TCF3::PBX1</li>
                    <li>t(4;11) – KMT2A::AF4</li>
                    <li>t(12;21) – ETV6::RUNX1</li>
                </ul>
                </li>
            </ul>
            </div>

            <!-- Contenido específico T -->
            <div id="llaContenidoT" style="display:${showT ? 'block' : 'none'}">
            T: SIL::TAL por qRT-PCR
            </div>
        `;
    } else if (estudio === "Síndrome mielodisplásico") {
        mensajeHTML = `<strong>Información específica sobre Síndrome mielodisplásico:</strong><br>
                        Cariotipo<br> 
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
                            Nota: Si al diagnóstico no se conoce esta información, se debe notificar vía mail posteriormente
                        </div>`;
        
    } else if (estudio === "Leucemia mielomonocítica crónica") {

        mensajeHTML = `<strong>Información específica sobre Leucemia mielomonocítica crónica:</strong><br>
                        Cariotipo<br> 
                        FISH: 5q, 7q, C-8, 20q.<br>
                        Panel de NGS mieloide en pacientes candidatos a aloTPH`;

    } else if (estudio === "Neoplasias mieloproliferativas crónicas no LMC") {

        mensajeHTML = `<strong>Información específica sobre Neoplasias mieloproliferativas crónicas no LMC:</strong><br>
                        Cariotipo<br> 
                        FISH: t(9;22)<br>
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
                        Mutaciones de JAK2`;

    } else if (estudio === "Leucemia mieloide crónica") {

        mensajeHTML = `<strong>Información específica sobre Leucemia mieloide crónica:</strong><br>
                        FISH: t(9;22)<br>
                        qRT-PCR: t(9;22) – BCR::ABL<br>
                        Seguimiento: qRT-PCR de t(9;22) - BCR::ABL`;

    } else if (estudio === "Eosinofilia") {
        
        mensajeHTML = `<strong>Información específica sobre Eosinofilia:</strong><br>
                        Cariotipo<br> 
                        FISH de PDGFRA y PDGFRB`;

    } else if (estudio === "Leucemia neutrofílica crónica") {

        mensajeHTML = `<strong>Información específica sobre Leucemia neutrofílica crónica:</strong><br>
                        Mutaciones de CSF3R`;

    } else if (estudio === "Mastocitosis") {

        mensajeHTML = `<strong>Información específica sobre Mastocitosis:</strong><br>
                        Cariotipo<br>
                        Mutación de KIT`;

    } else if (estudio === "Aplasia medular") {

        mensajeHTML = `<strong>Información específica sobre Aplasia medular:</strong><br>
                        Cariotipo en médula ósea<br>
                        Fragilidad cromosómica en sangre periférica`;

    } else if (estudio === "Citopenias aisladas") {

        mensajeHTML = `<strong>Información específica sobre Citopenias aisladas:</strong><br>
                        Cariotipo<br>
                        Se guarda ADN hasta concretar diagnóstico`;

    } else if (estudio === "Leucemia linfática crónica") {
        if (esRecaida) {
                mensajeHTML = `<strong>Se realizará el estudio si cumple criterios de tratamiento.</strong><br>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc1">
                                    <label class="form-check-label" for="llc1">Cariotipo<br> 
                                    FISH: C-12, 14q, 13q, 11q (ATM), 17p(TP53).</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc2">
                                    <label class="form-check-label" for="llc2">Mutaciones TP53</label>
                                </div>`;
            } else {
                mensajeHTML = `
                    <strong>Información específica sobre Leucemia linfática crónica:</strong><br>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc1">
                        <label class="form-check-label" for="llc1">
                            Al diagnóstico: Cariotipo<br>
                            Mutaciones de IGHV
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc2">
                        <label class="form-check-label" for="llc2">
                            Antes de tratamiento/recaída: Cariotipo<br>
                            FISH: C-12, 14q, 13q, 11q (ATM), 17p(TP53).<br>
                            Mutaciones TP53
                        </label>
                    </div>
                `;
            }

    } else if (estudio === "Tricoleucemia") {

        mensajeHTML = `<strong>Información específica sobre Tricoleucemia:</strong><br>
                        Mutaciones de BRAF`;

    } else if (estudio === "Sospecha de síndrome linfoproliferativo") {

        mensajeHTML = `<strong>Información específica sobre Sospecha de síndrome linfoproliferativo:</strong><br>
                        Se guardará ADN y células fijadas hasta definir el diagnóstico`;

    } else if (estudio === "Linfoma B difuso de célula grande") {

        mensajeHTML = `<strong>Información específica sobre Linfoma B difuso de célula grande:</strong><br>
                        <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                            Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                            Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                        </div>
                        Cariotipo<br> 
                        FISH: BCL2, BCL6, MYC y TP53`;

    } else if (estudio === "Linfoma folicular") {

        mensajeHTML = `<strong>Información específica sobre Linfoma folicular:</strong><br>
                        <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                            Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                            Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                        </div>
                        Cariotipo<br> 
                        FISH: t(14;18)`;

    } else if (estudio === "Linfoma de células del manto") {

        mensajeHTML = `<strong>Información específica sobre Linfoma de células del manto:</strong><br>
                        <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                            Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                            Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                        </div>
                        Cariotipo<br> 
                        FISH: t(11;14) y del(17p)<br>
                        Mutaciones de TP53`;

    } else if (estudio === "Mieloma Múltiple") {

        mensajeHTML = `<strong>Información específica sobre Mieloma Múltiple:</strong><br>
                        FISH: t(4;14), t(14;16), t(14;20), 1q/1p y 17p<br>
                        Mutaciones TP53 (si se confirma diagnóstico)
                        `;

    } else if (estudio === "Macroglobulinemia de Waldestrom") {

        mensajeHTML = `<strong>Información específica sobre Macroglobulinemia de Waldestrom:</strong><br>
                        FISH: del(6q), C-4, del(17p)<br>
                        Mutaciones de MYD88 y CXCR4<br>
                        Antes de tratamiento/recaída: Mutaciones de TP53 (si se confirma diagnóstico)
                        `;

    } else if (estudio === "Leucemia de linfocitos grandes granulares") {

        mensajeHTML = `<strong>Información específica sobre Leucemia de linfocitos grandes granulares:</strong><br>
                        Cariotipo`;

    } else if (estudio === "Linfoma no hodgkin T") {

        mensajeHTML = `<strong>Información específica sobre Linfoma no hodgkin T:</strong><br>
                        Cariotipo`;

    } else if (estudio === "Síndrome de VEXAS") {

        mensajeHTML = `<strong>Información específica sobre Síndrome de VEXAS:</strong><br>
                        Mutaciones UBA1`;

    } else if (estudio === "Hemofilia y Von Willebrand") {

        mensajeHTML = `<strong>Información específica sobre Hemofilia y Von Willebrand:</strong><br>
                        Panel de NGS de hemofilia y FVW`;

    } else {

        mensajeHTML = "Opción no reconocida";

    }
    
    const div = document.createElement('div');
    div.className = 'estudio-item';
    mensajeHTML = italicizeGenes(mensajeHTML);
    div.innerHTML = mensajeHTML;
    // Persistir y controlar la visibilidad según B/T/Desconocido
    if (estudio === "Leucemia linfoblástica aguda") {
        const hidden = document.getElementById('subtipoLLASeleccionado');
        const radios = div.querySelectorAll('input[name="subtipoLLA"]');
        const boxB = div.querySelector('#llaContenidoB');
        const boxT = div.querySelector('#llaContenidoT');

        function actualizar() {
            const sel = div.querySelector('input[name="subtipoLLA"]:checked')?.value || 'Desconocido';
            if (hidden) hidden.value = sel;
            // Mostrar sólo lo que toca
            boxB.style.display = sel === 'B' ? 'block' : 'none';
            boxT.style.display = sel === 'T' ? 'block' : 'none';
        }

        radios.forEach(r => r.addEventListener('change', actualizar));
        actualizar(); // estado inicial
    }
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
    
    const momentoId = document.querySelector('input[name="momentoEvolutivo"]:checked')?.id || '';
    const esRecaida = (momentoId === 'recaidaProgresion');

    estudios.forEach((estudio, index) => {
        const div = document.createElement('div');
        div.className = 'estudio-item';
        div.style.whiteSpace = 'normal';
        div.style.wordWrap = 'break-word';
        div.style.overflowWrap = 'break-word';
        div.style.maxWidth = '100%';
        
        let mensajeHTML = '';
        
        if (estudio === "Leucemia mieloblástica aguda") {

            if (esRecaida) {
                // Versión para recaída/progresión 
                mensajeHTML = `
                    <strong>Información específica sobre Leucemia mieloblástica aguda – Seleccione rango de edad:</strong><br><br>

                    <div class="row mb-2">
                        <div class="col-6">
                            Cariotipo<br> 
                            FISH: 5q, 7q, C-8, KMT2A (MLL).
                        </div>
                        <div class="col-6">
                            Traslocaciones por qRT-PCR: Si se detectó alguna al diagnóstico
                        </div>
                    </div>

                    <div class="mt-2 mb-2">
                        <label class="form-label d-block mb-1">Rango de edad:</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="lmaEdad" id="lmaMenor75" value="menor75">
                            <label class="form-check-label" for="lmaMenor75">Menor de 75 años</label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="lmaEdad" id="lma7585" value="75a85">
                            <label class="form-check-label" for="lma7585">75 a 85 años</label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="lmaEdad" id="lmaMas85" value="mas85">
                            <label class="form-check-label" for="lmaMas85">Mayor de 85 años</label>
                        </div>
                    </div>

                    <hr>

                    <!-- Contenido ≤75 años -->
                    <div id="lmaContMenor75" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-3">
                                Mutaciones de NPM1, FLT3 y IDH1/2.
                            </div>
                            <div class="col-3">
                                qRT-PCR: t(15;17), inv(16) y t(8;21) si han pasado más de 2 años desde el diagnóstico.
                            </div>
                            <div class="col-3">
                                Expresión WT1. Si han pasado más de 2 años desde el diagnóstico.
                            </div>
                            <div class="col-3">
                                Panel NGS mieloide
                            </div>
                        </div>
                    </div>

                    <!-- Contenido 75-85 -->
                    <div id="lmaCont7585" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-6">
                                Mutaciones de FLT3 y IDH1/2.
                            </div>
                            <div class="col-6">
                                Panel NGS mieloide
                            </div>
                        </div>
                    </div>

                    <!-- Contenido >85 -->
                    <div id="lmaContMas85" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-12">
                                Mutaciones de FLT3 y IDH1/2.
                            </div>
                        </div>
                    </div>
                `;

                // Activar el bloque correspondiente según el rango de edad elegido
                setTimeout(() => {
                    const r1 = document.getElementById("lmaMenor75");
                    const r2 = document.getElementById("lma7585");
                    const r3 = document.getElementById("lmaMas85");

                    const b1 = document.getElementById("lmaContMenor75");
                    const b2 = document.getElementById("lmaCont7585");
                    const b3 = document.getElementById("lmaContMas85");

                    function actualizar() {
                        b1.style.display = r1.checked ? "block" : "none";
                        b2.style.display = r2.checked ? "block" : "none";
                        b3.style.display = r3.checked ? "block" : "none";
                    }

                    if (r1) r1.addEventListener("change", actualizar);
                    if (r2) r2.addEventListener("change", actualizar);
                    if (r3) r3.addEventListener("change", actualizar);
                }, 50);

            } else {
                // Versión para diagnóstico
                mensajeHTML = `
                    <strong>Información específica sobre Leucemia mieloblástica aguda – Seleccione rango de edad:</strong><br><br>

                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="lmaEdad" id="lmaMenor75" value="menor75">
                        <label class="form-check-label" for="lmaMenor75">Menor de 75 años</label>
                    </div>

                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="lmaEdad" id="lma7585" value="75a85">
                        <label class="form-check-label" for="lma7585">75 a 85 años</label>
                    </div>

                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="lmaEdad" id="lmaMas85" value="mas85">
                        <label class="form-check-label" for="lmaMas85">Mayor de 85 años</label>
                    </div>

                    <hr>

                    <!-- Contenido Menor 75 -->
                    <div id="lmaContMenor75" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-3">
                                Cariotipo<br> 
                                FISH: 5q, 7q, C-8, KMT2A (MLL)
                                <br>
                                Traslocaciones por qRT-PCR:
                                <br>
                                t(15;17) – PML::RARA
                                <br>
                                t(8;21) – RUNX1::RUNX1T1
                                <br>
                                inv(16) – CBFB::MYH11
                            </div>

                            <div class="col-3">
                                Mutaciones:
                                <br>
                                - NPM1
                                <br>
                                - FLT3
                                <br>
                                - IDH1/2
                            </div>

                            <div class="col-3">
                                Expresión WT1
                            </div>

                            <div class="col-3">
                                Panel NGS mieloide
                            </div>
                        </div>
                    </div>

                    <!-- Contenido 75-85 -->
                    <div id="lmaCont7585" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-4">
                                Cariotipo<br> 
                                FISH: 5q, 7q, C-8, KMT2A (MLL)
                            </div>

                            <div class="col-4">
                                Mutaciones de IDH1/2
                            </div>

                            <div class="col-4">
                                Panel NGS mieloide
                            </div>
                        </div>
                    </div>

                    <!-- Contenido mayor 85 -->
                    <div id="lmaContMas85" style="display:none; margin-top:10px;">
                        <div class="row">
                            <div class="col-6">
                                Cariotipo<br> 
                                FISH: 5q, 7q, C-8, KMT2A (MLL)
                            </div>

                            <div class="col-6">
                                Mutaciones de IDH1/2
                            </div>
                        </div>
                    </div>
                `;

                // Listeners para diagnóstico 
                setTimeout(() => {
                    const r1 = document.getElementById("lmaMenor75");
                    const r2 = document.getElementById("lma7585");
                    const r3 = document.getElementById("lmaMas85");

                    const b1 = document.getElementById("lmaContMenor75");
                    const b2 = document.getElementById("lmaCont7585");
                    const b3 = document.getElementById("lmaContMas85");

                    function actualizar() {
                        b1.style.display = r1.checked ? "block" : "none";
                        b2.style.display = r2.checked ? "block" : "none";
                        b3.style.display = r3.checked ? "block" : "none";
                    }

                    if (r1) r1.addEventListener("change", actualizar);
                    if (r2) r2.addEventListener("change", actualizar);
                    if (r3) r3.addEventListener("change", actualizar);
                }, 50);
            }
        }else if (estudio === "Leucemia linfoblástica aguda") {

            const subtipoGuardado = document.getElementById('subtipoLLASeleccionado')?.value || '';

            // decide visibilidad inicial de los bloques según lo guardado
            const showB = subtipoGuardado === 'B';
            const showT = subtipoGuardado === 'T';

            mensajeHTML = `
                <strong>Información específica sobre Leucemia aguda linfoblástica:</strong><br>

                <div class="mt-2 mb-2">
                <label class="form-label d-block mb-1">Subtipo de LLA:</label>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="subtipoLLA" id="llaB" value="B" ${showB ? 'checked' : ''}>
                    <label class="form-check-label" for="llaB">B</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="subtipoLLA" id="llaT" value="T" ${showT ? 'checked' : ''}>
                    <label class="form-check-label" for="llaT">T</label>
                </div>
                </div>

                <!-- Contenido específico B -->
                <div id="llaContenidoB" style="display:${showB ? 'block' : 'none'}">
                Cariotipo<br>
                B: Traslocaciones por FISH:
                <ul>
                    <li>t(9;22)</li>
                    <li>KMT2A (MLL)</li>
                    <li>t(1;19)</li>
                    <li>t(12;21)</li>
                    <li>qRT-PCR si positivo por FISH:
                    <ul>
                        <li>t(9;22) – BCR::ABL</li>
                        <li>t(1;19) – TCF3::PBX1</li>
                        <li>t(4;11) – KMT2A::AF4</li>
                        <li>t(12;21) – ETV6::RUNX1</li>
                    </ul>
                    </li>
                </ul>
                </div>

                <!-- Contenido específico T -->
                <div id="llaContenidoT" style="display:${showT ? 'block' : 'none'}">
                T: SIL::TAL por qRT-PCR
                </div>
            `;
        } else if (estudio === "Síndrome mielodisplásico") {
            mensajeHTML = `<strong>Información específica sobre Síndrome mielodisplásico:</strong><br>
                            Cariotipo<br> 
                            FISH: 5q, 7q, C-8 y 20q<br>
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
                                Nota: Si al diagnóstico no se conoce esta información, se debe notificar vía mail posteriormente
                            </div>`;
            
        } else if (estudio === "Leucemia mielomonocítica crónica") {

            mensajeHTML = `<strong>Información específica sobre Leucemia mielomonocítica crónica:</strong><br>
                            Cariotipo<br> 
                            FISH: 5q, 7q, C-8, 20q<br>
                            Panel de NGS mieloide en pacientes candidatos a aloTPH`;

        } else if (estudio === "Neoplasias mieloproliferativas crónicas no LMC") {

            mensajeHTML = `<strong>Información específica sobre Neoplasias mieloproliferativas crónicas no LMC:</strong><br>
                            Cariotipo<br> 
                            FISH: t(9;22)<br>
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
                            Mutaciones de JAK2`;

        } else if (estudio === "Leucemia mieloide crónica") {
            if (esRecaida) {
                    mensajeHTML = `
                    <strong>Información específica sobre Leucemia mieloide crónica:</strong><br>
                        <div class="row">
                            <div class="col-6">
                                qRT-PCR t(9;22) BCR::ABL
                            </div>
                            <div class="col-6">
                                Mutaciones de ABL
                            </div>
                        </div>
                    `;
                } else {
                    mensajeHTML = `
                        <strong>Información específica sobre Leucemia mieloide crónica:</strong><br>
                        FISH: t(9;22)<br>
                        qRT-PCR: t(9;22) – BCR::ABL<br>
                        Seguimiento: qRT-PCR de t(9;22) - BCR::ABL
                    `;
                }
        } else if (estudio === "Eosinofilia") {
            
            mensajeHTML = `<strong>Información específica sobre Eosinofilia:</strong><br>
                            Cariotipo<br> 
                            FISH de PDGFRA y PDGFRB`;

        } else if (estudio === "Leucemia neutrofílica crónica") {

            mensajeHTML = `<strong>Información específica sobre Leucemia neutrofílica crónica:</strong><br>
                            Mutaciones de CSF3R`;

        } else if (estudio === "Mastocitosis") {

            mensajeHTML = `<strong>Información específica sobre Mastocitosis:</strong><br>
                            Cariotipo<br>
                            Mutación de KIT`;

        } else if (estudio === "Aplasia medular") {

            mensajeHTML = `<strong>Información específica sobre Aplasia medular:</strong><br>
                            Cariotipo en médula ósea<br>
                            Fragilidad cromosómica en sangre periférica`;

        } else if (estudio === "Citopenias aisladas") {

            mensajeHTML = `<strong>Información específica sobre Citopenias aisladas:</strong><br>
                            Cariotipo<br>
                            Se guarda ADN hasta concretar diagnóstico`;

        } else if (estudio === "Leucemia linfática crónica") {

            if (esRecaida) {
                    mensajeHTML =`<strong>Se realizará el estudio si cumple criterios de tratamiento.</strong><br>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc1">
                                    <label class="form-check-label" for="llc1">Cariotipo<br> 
                                    FISH: C-12, 14q, 13q, 11q (ATM), 17p(TP53).</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc2">
                                    <label class="form-check-label" for="llc2">Mutaciones TP53</label>
                                </div>`;
                } else {
                    mensajeHTML =`
                        <strong>Información específica sobre Leucemia linfática crónica:</strong><br>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc1">
                            <label class="form-check-label" for="llc1">
                                Al diagnóstico: Cariotipo<br>
                                Mutaciones de IGHV
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="llcOpciones" id="llc2">
                            <label class="form-check-label" for="llc2">
                                Antes de tratamiento/recaída: Cariotipo<br> 
                                FISH: C-12, 14q, 13q, 11q (ATM), 17p(TP53).<br>
                                Mutaciones TP53
                            </label>
                        </div>
                    `;
                }
        } else if (estudio === "Tricoleucemia") {

            mensajeHTML = `<strong>Información específica sobre Tricoleucemia:</strong><br>
                            Mutaciones de BRAF`;

        } else if (estudio === "Sospecha de síndrome linfoproliferativo") {

            mensajeHTML = `<strong>Información específica sobre Sospecha de síndrome linfoproliferativo:</strong><br>
                            Se guardará ADN y células fijadas hasta definir el diagnóstico`;

        } else if (estudio === "Linfoma B difuso de célula grande") {
            if(esRecaida){ 
                mensajeHTML = `
                    <div>
                        <strong>Linfoma B difuso de célula grande:</strong><br>
                        Se guardará DNA hasta confirmación de pruebas pertinentes
                    </div>
                `;
            }else{
            mensajeHTML = `<strong>Información específica sobre Linfoma B difuso de célula grande:</strong><br>
                            <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                                Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                                Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                            </div>
                            Cariotipo<br> 
                            FISH: BCL2, BCL6, MYC y TP53`;
            }

        } else if (estudio === "Linfoma folicular") {
            if(esRecaida){
                mensajeHTML=`<strong>Información específica sobre Linfoma folicular:</strong><br>
                    <div class="row">                  
                        Se guardará DNA hasta confirmación de pruebas pertinentes<br>
                    </div>`;
            }else{
                mensajeHTML = `<strong>Información específica sobre Linfoma folicular:</strong><br>
                                <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                                    Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                                    Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                                </div>
                                Cariotipo<br> 
                                FISH: t(14;18)`;
            }

        } else if (estudio === "Linfoma de células del manto") {
            if(esRecaida){
                mensajeHTML = `
                    <strong>Información específica sobre Linfoma de células del manto:</strong><br><br>

                    <div class="row">
                        <div class="col-6">
                            Cariotipo y FISH:
                            del(17p): Si no presentaba del(17p) al diagnóstico
                        </div>

                        <div class="col-6">
                            Panel de NGS de mutaciones de TP53:
                            Si no presentaba mutaciones de <em>TP53</em> al diagnóstico
                        </div>
                    </div>
                `;
            }else{
                mensajeHTML = `<strong>Información específica sobre Linfoma de células del manto:</strong><br>
                                <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">
                                    Nota 1: Solo se harán los estudios en tejidos que estén infiltrados por el linfoma (rogamos confirmar % de infiltración)<br>
                                    Nota 2: No se repetirá el estudio de FISH si ya se ha realizado en otro tejido infiltrado de ese paciente, salvo excepción justificada
                                </div>
                                Cariotipo<br> 
                                FISH: t(11;14) y del(17p)<br>
                                Mutaciones de TP53
                                `;
            }

        } else if (estudio === "Mieloma Múltiple") {

                mensajeHTML = `<strong>Información específica sobre Mieloma Múltiple:</strong><br>
                                FISH: t(4;14), t(14;16), t(14;20), 1q/1p y 17p<br>
                                Mutaciones TP53 (si se confirma diagnóstico)
                                `;
            
        } else if (estudio === "Macroglobulinemia de Waldestrom") {
            mensajeHTML = `<strong>Información específica sobre Macroglobulinemia de Waldestrom:</strong><br>
                            FISH: del(6q), C-4, del(17p)<br>
                            Mutaciones de MYD88 y CXCR4<br>
                            Antes de tratamiento/recaída: Mutaciones de TP53 (si se confirma diagnóstico)
                            `;

        } else if (estudio === "Leucemia de linfocitos grandes granulares") {

            mensajeHTML = `<strong>Información específica sobre Leucemia de linfocitos grandes granulares:</strong><br>
                            Cariotipo`;

        } else if (estudio === "Linfoma no hodgkin T") {

            mensajeHTML = `<strong>Información específica sobre Linfoma no hodgkin T:</strong><br>
                            Cariotipo`;

        } else if (estudio === "Síndrome de VEXAS") {

            mensajeHTML = `<strong>Información específica sobre Síndrome de VEXAS:</strong><br>
                            Mutaciones UBA1`;

        } else if (estudio === "Hemofilia y Von Willebrand") {

            mensajeHTML = `<strong>Información específica sobre Hemofilia y Von Willebrand:</strong><br>
                            Panel de NGS de hemofilia y FVW`;

        } else {

            mensajeHTML = "Opción no reconocida";

        }
        
        mensajeHTML = italicizeGenes(mensajeHTML);
        div.innerHTML = mensajeHTML;
        // Persistir y controlar la visibilidad según B/T/Desconocido
        if (estudio === "Leucemia linfoblástica aguda") {
        const hidden = document.getElementById('subtipoLLASeleccionado');
        const radios = div.querySelectorAll('input[name="subtipoLLA"]');
        const boxB = div.querySelector('#llaContenidoB');
        const boxT = div.querySelector('#llaContenidoT');

        function actualizar() {
            const sel = div.querySelector('input[name="subtipoLLA"]:checked')?.value || 'Desconocido';
            if (hidden) hidden.value = sel;
            // Mostrar sólo lo que toca
            boxB.style.display = sel === 'B' ? 'block' : 'none';
            boxT.style.display = sel === 'T' ? 'block' : 'none';
        }

        radios.forEach(r => r.addEventListener('change', actualizar));
        actualizar(); // estado inicial
        }

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
        <div class="hemo-field">
            <label>Hb</label>
            <input type="number" class="form-control" id="hbValor">
        </div>
        <div class="hemo-field">
            <label>Leucocitos</label>
            <input type="number" class="form-control" id="leucocitosValor">
        </div>
        <div class="hemo-field">
            <label>Neutrófilos</label>
            <input type="number" id="hemoNeut" class="form-control">
            <div id="err-hemo-neut" class="error-msg"></div>
        </div>
        <div class="hemo-field">
            <label>Linfocitos</label>
            <input type="number" id="hemoLinf" class="form-control">
            <div id="err-hemo-linf" class="error-msg"></div>
        </div>
        <div class="hemo-field">
            <label>Plaquetas</label>
            <input type="number" class="form-control" id="plaquetasValor">
        </div>
        <div class="hemo-field">
            <label>Blastos</label>
            <input type="number" class="form-control" id="blastosValor">
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
    const ensayoInput = document.getElementById('ensayoClinicoTexto');

    if (opcion === 'Si') {
        detallesDiv.style.display = 'block';
        ensayoInput?.focus();
    } else {
        detallesDiv.style.display = 'none';
        if (ensayoInput) ensayoInput.value = '';   // limpiar texto
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

// Gestión de errores (antiduplicados)
function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(n => n.remove());
}

function getOrCreateError(id, anchorEl) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('span');
    el.id = id;
    el.className = 'error-msg';
    el.style.color = 'red';
    el.style.fontSize = '13px';
    el.style.marginLeft = '8px';
    anchorEl.appendChild(el);
  }
  return el;
}

function removeError(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function validarFormulario() {
    clearErrors();      // limpia todo antes de validar

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
    if (errorLabDecision) errorLabDecision.remove();


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

    // HEMOGRAMA: campos opcionales
    ['hbValor','leucocitosValor','neulinfValor','plaquetasValor','blastosValor']
        .forEach(id => removeError(`err-hemo-${id}`));


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

    // VALIDAR FECHA DE EXTRACCIÓN
    const fecha = document.getElementById("fechaExtraccion").value;
    if (!fecha) {
        const anchor = document.getElementById("fechaExtraccion").parentElement; // mismo lugar
        const err = getOrCreateError('err-fecha', anchor);
        err.textContent = "La fecha de extracción es obligatoria";
        formularioValido = false;
    } else {
        removeError('err-fecha');
    }



    // VALIDAR TIPO DE MUESTRA
    const checkboxesMuestra = document.querySelectorAll('input[name="tipoMuestra"]');
    let seleccionadoMuestra = false;

    checkboxesMuestra.forEach(function (checkbox) {
        if (checkbox.checked) {
            seleccionadoMuestra = true;
        }
    });

    if (document.getElementById("err-tipo-muestra")) {
        document.getElementById("err-tipo-muestra").remove();
    }

    if (!seleccionadoMuestra) {
        formularioValido = false;
        errorTipoMuestra = document.createElement("span");
        errorTipoMuestra.style.color = "red";
        errorTipoMuestra.style.fontSize = "13px";
        errorTipoMuestra.textContent = "Debe seleccionar al menos un tipo de muestra";
        document.getElementById('tipoMuestra').after(errorTipoMuestra);
    }

    //Otras muestras: texto obligatorio si está marcado
    const otrasMarcada = document.getElementById('otrasMuestras')?.checked;
    const otrosTexto   = document.getElementById('otrosInputMuestra')?.value.trim() || '';
    removeError('err-otros-muestra');

    if (otrasMarcada && !otrosTexto) {
        const anchor = document.getElementById('otrosInputMuestra').parentElement; // div .inputMuestra
        const err = getOrCreateError('err-otros-muestra', anchor);
        err.textContent = 'Especifique el tipo de muestra';
        formularioValido = false;
    }
    // Infiltración: Si hay valor, solo validar que sea 0–100.
    const infInput  = document.getElementById('infiltracion');
    const infValRaw = infInput?.value ?? '';
    const infValNum = infValRaw === '' ? NaN : Number(infValRaw);
    removeError('err-infiltracion');

    if (infValRaw !== '') {
        // Solo comprobamos rango si el usuario ha escrito algo
        const invalida = Number.isNaN(infValNum) || infValNum < 0 || infValNum > 100;
        if (invalida) {
            const anchor = infInput.parentElement; // 
            const err = getOrCreateError('err-infiltracion', anchor);
            err.textContent = 'Si indica infiltración, debe ser un % entre 0 y 100';
            formularioValido = false;
        }
    }

    document.getElementById('otrosInputMuestra')?.addEventListener('input', () => removeError('err-otros-muestra'));
    document.getElementById('infiltracion')?.addEventListener('input', () => removeError('err-infiltracion'));


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

    //Postrasplante: si está elegido, días obligatorio
    const postTxChecked = document.getElementById('postransplante')?.checked;
    const postTxInput = document.getElementById('postTxDias');
    const postTxValRaw = postTxInput ? postTxInput.value.trim() : '';
    const postTxValNum = postTxValRaw === '' ? NaN : Number(postTxValRaw);

    // elimina mensaje previo para no duplicar
    document.getElementById('err-posttx')?.remove();

    if (postTxChecked) {
    const invalida = postTxValRaw === '' || Number.isNaN(postTxValNum) || postTxValNum < 0 || !Number.isInteger(postTxValNum);
    if (invalida) {
        const err = document.createElement('span');
        err.id = 'err-posttx';
        err.className = 'error-msg';
        err.style.marginLeft = '8px';
        err.textContent = 'Indique días desde el trasplante';
        // ancla junto al input de días
        postTxInput.parentElement.appendChild(err);
        formularioValido = false;
    }
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

    //  Marcador molecular obligatorio si "EMR" 
    const esEMR = document.getElementById('emr')?.checked;
    const inputMarcador = document.getElementById('marcadorMolecular');

    removeError('err-emr-marker');

    if (esEMR) {
    const val = (inputMarcador?.value ?? '').trim();
        if (!val) {
            const anchor = document.getElementById('emrMarker') || inputMarcador.parentElement;
            const err = getOrCreateError('err-emr-marker', anchor);
            err.textContent = 'Indique marcador molecular de seguimiento';
            formularioValido = false;
        }
    }


    // VALIDAR ENSAYO CLÍNICO
    const ensayoSeleccionado = document.getElementById("ensayoSeleccionado").value;
    const ensayoClinicoTexto = document.getElementById("ensayoClinicoTexto").value.trim();

    document.querySelectorAll("#errorEnsayo, #errorEnsayoTexto").forEach(e => e.remove());

    //No se ha seleccionado "Sí" ni "No"
    if (!ensayoSeleccionado) {
        formularioValido = false;
        const error = document.createElement("span");
        error.id = "errorEnsayo";
        error.style.color = "red";
        error.style.fontSize = "13px";
        error.textContent = "Debe indicar si existe ensayo clínico o protocolo";
        document.getElementById("ensayo").parentElement.appendChild(error);
    }

    //Se eligió "Sí" pero no se especificó el texto
    else if (ensayoSeleccionado === "Si" && !ensayoClinicoTexto) {
        formularioValido = false;
        const error = document.createElement("span");
        error.id = "errorEnsayoTexto";
        error.style.color = "red";
        error.style.fontSize = "13px";
        error.textContent = "Debe especificar el ensayo clínico o protocolo";
        document.getElementById("ensayoClinicoTexto").parentElement.appendChild(error);
    }

    //VALIDAR SELECCIÓN DE ESTUDIOS (OR lógico entre Protocolizados y Otros)
    const seleccionadoMomento = document.querySelector('input[name="momentoEvolutivo"]:checked')?.id || '';
    const protocolizadosPermitidos = (seleccionadoMomento === 'diagnostico' || seleccionadoMomento === 'recaidaProgresion');

    const tieneProtocolizado = (document.getElementById("estudiosSeleccionados")?.value || "").trim() !== "";
    const otrosMarcados = document.querySelectorAll('input[name="otrosEstudios"]:checked').length > 0;

    // limpia mensaje previo (antiduplicados)
    document.getElementById('err-estudios')?.remove();

    let cumple = false;
    if (protocolizadosPermitidos) {
        cumple = (tieneProtocolizado || otrosMarcados);
    } else {
        // Si no se permiten protocolizados (porque no es Diagnóstico/Recaída), solo cuentan "Otros"
        cumple = otrosMarcados;
    }

    if (!cumple) {
        const err = document.createElement('span');
        err.id = 'err-estudios';
        err.className = 'error-msg';
        err.textContent = "Debe seleccionar al menos un estudio";
        (document.querySelector(".tituloParte3") || document.body).appendChild(err);
        formularioValido = false;
    }

    // VALIDAR A CUMPLIMENTAR POR EL LABORATORIO 
    const labAcepto = document.getElementById('labAcepto');
    const labRechazo = document.getElementById('labRechazo');

    if (labAcepto && labRechazo) {
        const algunoMarcado = labAcepto.checked || labRechazo.checked;

        if (!algunoMarcado) {
            formularioValido = false;
            const anchor = labRechazo.closest('.col-12') || labRechazo.parentElement;
            const err = getOrCreateError('err-lab-decision', anchor);
            err.textContent = 'Debe marcar Acepto o Rechazo';
        } else {
            removeError('err-lab-decision');
        }
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

document.addEventListener('DOMContentLoaded', function () {
    const labAcepto = document.getElementById('labAcepto');
    const labRechazo = document.getElementById('labRechazo');

    if (labAcepto && labRechazo) {
        function hacerExclusivos(origen, otro) {
            if (origen.checked) {
                otro.checked = false;
            }
        }

        labAcepto.addEventListener('change', () => hacerExclusivos(labAcepto, labRechazo));
        labRechazo.addEventListener('change', () => hacerExclusivos(labRechazo, labAcepto));
    }
});
