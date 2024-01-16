(function() {
    const lat = 20.67444163271174;
    const lng = -103.38739216304566;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    //Utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Agregando el PIN
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    // Detectar el movimiento del pin
    marker.on('moveend', function(e){
        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(posicion);

        // Obtener la informacion de las calles
        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado){
            marker.bindPopup(resultado?.address?.LongLabel);

            //llenar los campos
            document.querySelector(".calle").textContent = resultado?.address?.LongLabel ?? "";
            document.querySelector("#calle").value = resultado?.address?.LongLabel ?? "";
            document.querySelector("#lat").value = resultado?.latlng?.lat ?? "";
            document.querySelector("#lng").value = resultado?.latlng?.lng ?? "";
        })
    })

})()