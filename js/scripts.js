document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('form');

    const enviarInfo = async (nombre, alias, rut, email, region, comuna, candidato, enterar) => {

        let formdata = new FormData;

        formdata.append('nombre', nombre);
        formdata.append('alias', alias);
        formdata.append('rut', rut);
        formdata.append('email', email);
        formdata.append('region', region);
        formdata.append('comuna', comuna);
        formdata.append('candidato', candidato);
        formdata.append('enterar', enterar);
        formdata.append('type', 'sendVot');

        const req = await fetch(`../php/guardar-voto.php`, {
            method: 'POST',
            body: formdata
        });

        return await req.json();
    }

    const enviarForm = (e) => {

        e.preventDefault();

        let nombre    = document.querySelector('#nombre').value,
            alias     = document.querySelector('#alias').value,
            rut       = document.querySelector('#rut').value,
            email     = document.querySelector('#email').value,
            region    = document.querySelector('#region').value,
            comuna    = document.querySelector('#comuna').value,
            candidato = document.querySelector('#candidato').value,
            enterar   = document.querySelector('input[type=radio][name=como-enterar]:checked').value;
        
        if(nombre === ''){
            Swal.fire(
                'Error!',
                'Por favor complete el Nombre y Apellido',
                'error'
              )
              return;
        }
        
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(alias)) {
          Swal.fire(
            'Error!',
            'El Alias debe contener letras y al menos un número',
            'error'
          )
          return;
        } 

        if(validarRut(rut) === false) {
          Swal.fire(
            'Error!',
            'Ingrese un RUT valido',
            'error'
          )
          return;
        }

        if(!validarEmail(email)) {
          Swal.fire(
            'Error!',
            'Ingrese un E-Mail valido',
            'error'
          )
          return;
        }

        enviarInfo(nombre, alias, rut, email, region, comuna, candidato, enterar)
        .then(data => {

          if(data.status === 'rut_repeat') {
            Swal.fire(
              'Error!',
              'Ya hay un voto registrado con ese RUT',
              'error'
            )

          } else if(data.status === 'success') {
            form.reset();

            Swal.fire(
              'Gracias!',
              'Su voto fue registrado correctamente',
              'success'
            )

          }
        })
    }

    form.addEventListener('submit', enviarForm);

    fetch('regiones.json')
    .then(response => response.json())
    .then(data => {
      const regionSelect = document.getElementById('region');
      const comunaSelect = document.getElementById('comuna');
  
      data.regiones.forEach(region => {
        const option = document.createElement('option');
        option.value = region.region;
        option.textContent = region.region;
        regionSelect.appendChild(option);
      });
  
      regionSelect.addEventListener('change', () => {

        comunaSelect.innerHTML = '<option value="" selected disabled>--Seleccione una Comuna--</option>';
        const selectedRegion = regionSelect.value;
        const selectedComunas = data.regiones.find(region => region.region === selectedRegion).comunas;
  
        selectedComunas.forEach(comuna => {
          const option = document.createElement('option');
          option.value = comuna;
          option.textContent = comuna;
          comunaSelect.appendChild(option);
        });
      });
    })
    .catch(error => console.error(error));

    function validarRut(rut) {
      // Comprobar formato del rut
      if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false;
    
      // Comprobar dígito verificador
      let rutSinDV = rut.split('-')[0];
      let dv = rut.split('-')[1];
    
      let factor = 2;
      let suma = 0;
      for (let i = rutSinDV.length - 1; i >= 0; i--) {
        suma += factor * rutSinDV.charAt(i);
        factor = factor === 7 ? 2 : factor + 1;
      }
    
      let dvCalculado = 11 - (suma % 11);
      dvCalculado = dvCalculado === 11 ? 0 : dvCalculado === 10 ? 'K' : dvCalculado;
    
      return dv.toString().toUpperCase() === dvCalculado.toString().toUpperCase();
    }

    function validarEmail(email) {
      // Expresión regular para validar el email
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    function cargarCandidatos() {
			fetch("../php/candidatos.php")
				.then(response => response.json()) // Convertir la respuesta a formato JSON
				.then(data => {
					const selectCandidatos = document.getElementById("candidato");
					data.forEach(candidato => {
						const option = document.createElement("option");
						option.text = candidato;
						option.value = candidato;
						selectCandidatos.add(option);
					});
				})
				.catch(error => console.error(error)); 
		}

    cargarCandidatos();
    

    
})


