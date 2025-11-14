const STATUS_ELEMENTO = document.getElementById("status");
const MAPA_ELEMENTO = document.getElementById("mapa");
const RAIO_METROS = 200;

let mapa;
let circulo;
let marcador;

function atualizarStatus(mensagem, ehErro = false) {
  STATUS_ELEMENTO.textContent = mensagem;
  STATUS_ELEMENTO.style.color = ehErro ? "#b91c1c" : "#475569";
}

function inicializarMapa() {
  if (!navigator.geolocation) {
    atualizarStatus("Seu navegador não suporta geolocalização.", true);
    return;
  }

  atualizarStatus("Tentando obter sua localização...");
  navigator.geolocation.getCurrentPosition(aoObterLocalizacao, aoFalharLocalizacao, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  });
}

function aoObterLocalizacao(posicao) {
  const { latitude, longitude } = posicao.coords;
  const coordenadas = { lat: latitude, lng: longitude };

  mapa = new google.maps.Map(MAPA_ELEMENTO, {
    zoom: 17,
    center: coordenadas,
    mapTypeId: "roadmap",
    disableDefaultUI: false,
  });

  marcador = new google.maps.Marker({
    position: coordenadas,
    map: mapa,
    title: "Você está aqui",
  });

  circulo = new google.maps.Circle({
    map: mapa,
    center: coordenadas,
    radius: RAIO_METROS,
    fillColor: "#3b82f6",
    fillOpacity: 0.25,
    strokeColor: "#1d4ed8",
    strokeOpacity: 0.8,
    strokeWeight: 2,
  });

  atualizarStatus("Localização encontrada! O círculo mostra um raio de 200 metros.");
}

function aoFalharLocalizacao(erro) {
  console.warn("Erro ao obter localização:", erro);

  let mensagem = "Não foi possível obter sua localização.";
  switch (erro.code) {
    case erro.PERMISSION_DENIED:
      mensagem = "Permita o uso da localização para visualizar o mapa.";
      break;
    case erro.POSITION_UNAVAILABLE:
      mensagem = "As informações de localização estão indisponíveis.";
      break;
    case erro.TIMEOUT:
      mensagem = "Tempo esgotado ao tentar obter sua localização.";
      break;
    default:
      mensagem = `Erro desconhecido: ${erro.message}`;
  }

  atualizarStatus(mensagem, true);
}

