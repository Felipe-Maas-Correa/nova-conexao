export const coverage = {
  totalKmFibra: 1280,
  cidadesAtendidas: 5,
  clientesAtivos: 1800,
  // Cidades atendidas. `pontos` = torres com coordenadas reais,
  // extraídas do arquivo Torres.kmz fornecido pela Nova Conexão.
  cidades: [
    {
      id: "ajuricaba",
      nome: "Ajuricaba",
      uf: "RS",
      status: "ativo",
      torres: 18,
      cobertura: 98,
      // Centro da mancha urbana (conferido na imagem de satélite)
      lat: -28.239,
      lng: -53.7656,
      pontos: [
        { id: "aju-01", nome: "B. João Carlini (Cotrijui)", lat: -28.240667, lng: -53.759447 },
        { id: "aju-02", nome: "Linha 17 (Saboreal)", lat: -28.241117, lng: -53.779742 },
        { id: "aju-03", nome: "Linha 17 (Lorenzon)", lat: -28.26837, lng: -53.771461 },
        { id: "aju-04", nome: "Linha 15 (Vida Natural)", lat: -28.241728, lng: -53.812514 },
        { id: "aju-05", nome: "Linha 20 (Pizetta)", lat: -28.208472, lng: -53.748343 },
        { id: "aju-06", nome: "Linha 21 (Toso)", lat: -28.184917, lng: -53.754953 },
        { id: "aju-07", nome: "Linha 21 (Bizarello)", lat: -28.173827, lng: -53.737062 },
        { id: "aju-08", nome: "Linha 21 (Spitzer)", lat: -28.164189, lng: -53.73363 },
        { id: "aju-09", nome: "Linha 23 (Brigo)", lat: -28.25225, lng: -53.728071 },
        { id: "aju-10", nome: "Linha 23 (Bandeira)", lat: -28.271954, lng: -53.727542 },
        { id: "aju-11", nome: "Linha 24 (CRAT)", lat: -28.192318, lng: -53.72725 },
        { id: "aju-12", nome: "Linha 25 (Torquetti)", lat: -28.263779, lng: -53.70762 },
        { id: "aju-13", nome: "Linha 26 (Sangiogo)", lat: -28.244206, lng: -53.695607 },
        { id: "aju-14", nome: "Linha 26 (Bandeira)", lat: -28.226954, lng: -53.692153 },
        { id: "aju-15", nome: "Linha 29 (Kraemer)", lat: -28.267044, lng: -53.664795 },
        { id: "aju-16", nome: "Linha 29 (Magier)", lat: -28.255952, lng: -53.652092 },
        { id: "aju-17", nome: "Linha 30 (Antiga Escola)", lat: -28.17586, lng: -53.660413 },
        { id: "aju-18", nome: "Linha 30 (Mafalda)", lat: -28.163449, lng: -53.643227 }
      ]
    },
    {
      id: "nova-ramada",
      nome: "Nova Ramada",
      uf: "RS",
      status: "ativo",
      torres: 11,
      cobertura: 90,
      // Centro da mancha urbana (junto da torre Cotrijui Pinhal)
      lat: -28.0658,
      lng: -53.6967,
      pontos: [
        { id: "nr-01", nome: "Centro Administrativo", lat: -28.083626, lng: -53.706209 },
        { id: "nr-02", nome: "Hangar", lat: -28.100724, lng: -53.774722 },
        { id: "nr-03", nome: "Dallabrida", lat: -28.119798, lng: -53.783973 },
        { id: "nr-04", nome: "MASS", lat: -28.136407, lng: -53.703875 },
        { id: "nr-05", nome: "Agronova", lat: -28.113929, lng: -53.709358 },
        { id: "nr-06", nome: "Avila", lat: -28.119791, lng: -53.688185 },
        { id: "nr-07", nome: "Cotrijui Pinhal", lat: -28.065736, lng: -53.696531 },
        { id: "nr-08", nome: "Boehm", lat: -28.06581, lng: -53.724028 },
        { id: "nr-09", nome: "Dallabrida Esq. Umbú", lat: -28.052556, lng: -53.615414 },
        { id: "nr-10", nome: "Muller", lat: -28.054401, lng: -53.654378 },
        { id: "nr-11", nome: "POPRS155", lat: -28.034564, lng: -53.77189 }
      ]
    },
    // Sem torres detalhadas: o Torres.kmz só trouxe Ajuricaba e Nova Ramada.
    { id: "condor", nome: "Condor", uf: "RS", status: "ativo", torres: 2, cobertura: 85, lat: -28.2069, lng: -53.4869 },
    { id: "panambi", nome: "Panambi", uf: "RS", status: "ativo", torres: 3, cobertura: 92, lat: -28.2925, lng: -53.5017 },
    { id: "ijui", nome: "Ijuí", uf: "RS", status: "expansao", torres: 3, cobertura: 70, lat: -28.3878, lng: -53.9147 }
  ]
};
