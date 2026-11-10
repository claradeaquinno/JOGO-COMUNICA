/* Pictogramas locais: sem rede e sem figuras genéricas para palavras desconhecidas. */
function pictogramaSugestao(palavra) {
  const normalizar = texto => String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const formas = {
    quero: '<circle cx="17" cy="15" r="9" fill="#edd0a0"/><path d="M8 13q1-12 14-7l4 8-11-4-7 3Z" fill="#947868"/><path d="M5 57V38q0-13 13-13l8 6 12-8 4 7-18 13-7-5v19Z" fill="#bfdeef"/><path d="m36 25 5-4 6 2-1 5-6 3Z" fill="#edd0a0"/><circle cx="53" cy="15" r="9" fill="#f4d991"/><path d="M45 15h16m-8-9q-7 9 0 18 7-9 0-18" stroke-width="1.8"/>',
    agua: '<path d="M17 15h30l-4 39H21Z" fill="#bde4f3"/><path d="M20 31h24l-2 20H22Z" fill="#6bbbd8"/>',
    comida: '<circle cx="32" cy="33" r="19" fill="#fff6dc"/><circle cx="32" cy="33" r="12" fill="#b6d5b3"/><path d="M5 12v15m5-15v15m-5-6h5M8 27v28m48-43v43m0-43q-12 10 0 21"/>',
    maca: '<path d="M32 22C12 10 5 30 15 47q8 12 17 5 9 7 17-5c10-17 3-37-17-25Z" fill="#e7a69a"/><path d="M32 22V9m0 7q10-13 19-7-4 12-19 7" fill="#b5d2b9"/>',
    banana: '<path d="M13 12q0 36 36 26Q35 66 14 43 3 29 9 13Z" fill="#f4d991"/>',
    suco: '<path d="M17 21h30l-4 34H21Z" fill="#f4d991"/><path d="M35 42V10l13-5"/><circle cx="20" cy="22" r="9" fill="#ecc18f"/>',
    leite: '<path d="m20 7 20 0 8 12v36H16V19Z" fill="#f7faf8"/><path d="M16 24h32v20H16Z" fill="#bfdeef"/><path d="M20 7v12h28"/>',
    pao: '<path d="M12 31C0 14 22 3 32 13 43 3 64 15 52 31v23H12Z" fill="#edd0a0"/><path d="M22 23v8m10-10v10m10-8v8"/>',
    fruta: '<path d="M32 22C12 10 5 30 15 47q8 12 17 5 9 7 17-5c10-17 3-37-17-25Z" fill="#e7a69a"/><path d="M32 22V9"/>',
    casa: '<path d="M12 29 32 10l20 19v26H12Z" fill="#f4df9e"/><path d="M6 30 32 5l26 25M27 55V37h11v18"/><path d="M17 30h7v9h-7Z" fill="#bfdeef"/>',
    escola: '<path d="M9 22h46v34H9Z" fill="#f4df9e"/><path d="m9 22 23-15 23 15M27 56V40h10v16"/><path d="M16 30h6v6h-6Zm26 0h6v6h-6Z" fill="#bfdeef"/><path d="M32 7V2h13v7H32" fill="#b5d2b9"/>',
    parque: '<path d="M19 56V32m26 24V32"/><circle cx="19" cy="21" r="14" fill="#b5d2b9"/><circle cx="45" cy="25" r="13" fill="#b5d2b9"/><path d="M7 57h50"/>',
    banheiro: '<path d="M18 7h20v22H18Z" fill="#bfdeef"/><path d="M12 31h42q0 18-20 18v8H22v-8Q12 46 12 31Z" fill="#f7faf8"/><path d="M14 29h40M25 14h7"/>',
    hospital: '<rect x="10" y="9" width="44" height="48" rx="4" fill="#f7faf8"/><path d="M27 15h10v8h8v10h-8v8H27v-8h-8V23h8Z" fill="#b5d2b9"/><path d="M26 57V46h12v11"/>',
    quarto: '<path d="M8 26v29m48-29v29M8 45h48V30H8" fill="#bfdeef"/><rect x="12" y="22" width="17" height="11" rx="4" fill="#fff6dc"/><path d="M29 30h27v15H29Z" fill="#b5d2b9"/>',
    pessoa: '<circle cx="32" cy="19" r="12" fill="#edd0a0"/><path d="M12 57V45c0-20 40-20 40 0v12Z" fill="#bfdeef"/>',
    mae: '<path d="M13 32V19c0-22 38-22 38 0v13" fill="#947868"/><circle cx="32" cy="22" r="13" fill="#edd0a0"/><path d="M10 57q0-34 22-22 22-12 22 22Z" fill="#b5d2b9"/>',
    pai: '<circle cx="32" cy="22" r="13" fill="#edd0a0"/><path d="M18 18q-2-23 28-10l3 13-13-9-18 6Z" fill="#947868"/><path d="M10 57q0-32 22-22 22-10 22 22Z" fill="#bfdeef"/>',
    abraco: '<circle cx="23" cy="17" r="10" fill="#edd0a0"/><circle cx="43" cy="21" r="10" fill="#edd0a0"/><path d="M10 54V37q0-13 16-11l23 13-7 9-22-9v15Z" fill="#bfdeef"/><path d="M53 56V40L28 29l-6 9 19 10v8Z" fill="#b5d2b9"/>',
    coracao: '<path d="M32 54C-9 28 15 0 32 19 49 0 73 28 32 54Z" fill="#e6b9ad"/>',
    dormir: '<path d="M8 27v28m48-28v28M8 46h48V31H8" fill="#bfdeef"/><rect x="12" y="23" width="17" height="11" rx="4" fill="#fff6dc"/><path d="M43 4q-8 16 9 18Q30 29 31 12Z" fill="#f4df9e"/>',
    brincar: '<circle cx="32" cy="32" r="24" fill="#f4df9e"/><path d="M8 32h48M32 8q-20 24 0 48 20-24 0-48Z" fill="#bfdeef"/>',
    desenhar: '<rect x="8" y="19" width="39" height="39" rx="3" fill="#fff6dc"/><path d="m23 42 5-14L47 6l10 9-20 23-14 4Z" fill="#f4d991"/><path d="m28 28 9 10M14 50h22"/>',
    musica: '<path d="M28 43V13l25-6v30M28 21l25-6"/><ellipse cx="19" cy="46" rx="10" ry="7" fill="#bfdeef"/><ellipse cx="44" cy="40" rx="10" ry="7" fill="#b5d2b9"/>',
    assistir: '<rect x="6" y="12" width="52" height="37" rx="5" fill="#bfdeef"/><path d="m27 21 15 10-15 10Z" fill="#fff6dc"/><path d="M23 56h18m-9-7v7"/>',
    passear: '<circle cx="34" cy="10" r="7" fill="#edd0a0"/><path d="m29 20 11 3 6 15m-17-18-9 17-10 4m18-5 10 7 7 15m-17-22-5 13-9 10" stroke-width="6"/>',
    dor: '<path d="m22 10 32 32-12 12L10 22Z" fill="#e6b9ad"/><path d="m42 10 12 12-32 32-12-12Z" fill="#f4df9e"/><path d="M28 28h8v8h-8Z" fill="#fff6dc"/>',
    ajuda: '<path d="M13 55V28q0-6 6-3V12q0-7 6-2V7q0-7 6-1v16-14q3-7 6 0v15-10q4-6 6 1v22l6-7q9-4 7 4L43 55Z" fill="#edd0a0"/>'
  };
  const aliases = {beber:'agua', comer:'comida', refeicao:'comida', lanche:'pao', bola:'brincar', jogar:'brincar', pintar:'desenhar', desenho:'desenhar', televisao:'assistir', tv:'assistir', ouvir:'musica', amigo:'pessoa', amiga:'pessoa', professor:'pessoa', professora:'pessoa', eu:'pessoa', voce:'pessoa', nos:'abraco', obrigado:'coracao', gosto:'coracao', carinho:'coracao', descansar:'dormir', sono:'dormir', cama:'quarto', medico:'hospital', remedio:'hospital'};
  const termo = normalizar(palavra);
  if (['quero', 'ajuda', 'ajudar', 'preciso de ajuda', 'pode ajudar'].includes(termo)) return '';
  const sentimentos = {feliz:'feliz', alegria:'feliz', bem:'feliz', triste:'triste', tristeza:'triste', cansado:'sono', cansada:'sono', medo:'medo', bravo:'bravo', brava:'bravo', raiva:'bravo'};
  let desenho;
  const sentimento = sentimentos[termo.replace(/^(estou |com )/, '')];
  if (sentimento) {
    const bocas = {feliz:'M21 36q11 17 22 0', triste:'M21 46q11-16 22 0', sono:'M20 27h7m10 0h7M25 41h14', medo:'M28 38q4-5 8 0v9h-8Z', bravo:'M19 23l9 5m8 0 9-5M23 44q9-8 18 0'};
    desenho = '<circle cx="32" cy="32" r="25" fill="#f4df9e"/><path d="M23 29v2m18-2v2"/>' + '<path d="'+bocas[sentimento]+'"/>';
  } else {
    const base = termo.replace(/^(quero |preciso de |com |ir ao |ir para |estou com )/, '');
    desenho = formas[base] || formas[aliases[base]];
  }
  if (!desenho) return '';
  return '<svg class="sugestao-pictograma" viewBox="0 0 64 64" fill="none" stroke="#26485d" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+desenho+'</svg>';
}
