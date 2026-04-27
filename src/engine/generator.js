export const generateQuestion = (moduleId, level = 1, currentQ = 1) => {
  let q = "";
  let answer = 0;
  let options = [];
  let astuce = "";

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randEl = (arr) => arr[Math.floor(Math.random() * arr.length)];

  switch (moduleId) {
    case 'additions': {
      const a = rand(10 * level, 50 * level);
      const b = rand(10 * level, 50 * level);
      q = `${a} + ${b} = ?`;
      answer = a + b;
      astuce = "Décompose les dizaines et les unités.";
      break;
    }
    case 'soustractions': {
      const a = rand(20 * level, 100 * level);
      const b = rand(1 * level, a);
      q = `${a} - ${b} = ?`;
      answer = a - b;
      astuce = "Passe par la dizaine inférieure la plus proche.";
      break;
    }
    case 'multiplications': {
      const a = rand(2, 6 + level * 2);
      const b = rand(2, 6 + level * 2);
      q = `Combien font ${a} x ${b} ?`;
      answer = a * b;
      astuce = `Rappelle-toi de la table de ${Math.min(a, b)} !`;
      break;
    }
    case 'divisions': {
      const b = rand(2, 6 + level);
      const ans = rand(2, 9 + level);
      const a = b * ans;
      q = `${a} ÷ ${b} = ?`;
      answer = ans;
      astuce = `Pense à la multiplication à trou : ${b} x ? = ${a}`;
      break;
    }
    case 'fractions': {
      const bases = [[1,2], [1,3], [2,3], [1,4], [3,4], [1,5], [2,5], [3,5], [4,5]];
      const [n, d] = randEl(bases);
      const k = rand(2, 6);
      q = `Simplifie la fraction ${n*k}/${d*k}`;
      answer = `${n}/${d}`;
      astuce = `Divise en haut et en bas par ${k}.`;
      options = [answer, `${n+1}/${d}`, `${n}/${d+1}`, `${n*2}/${d*2+1}`];
      break;
    }
    case 'decimaux': {
      // Lien décimal / pourcentage
      const isPercentToDec = Math.random() > 0.5;
      if (isPercentToDec) {
         const p = randEl([10, 20, 25, 50, 75, 100]);
         q = `Transforme ${p}% en nombre décimal`;
         answer = String(p / 100).replace('.', ',');
         astuce = `Divise par 100 : déplace la virgule de 2 rangs à gauche.`;
         options = [answer, String(p*10), String(p/10).replace('.', ','), String(p)];
      } else {
         const p = randEl([10, 20, 25, 50, 75, 100]);
         const dec = (p / 100).toString().replace('.', ',');
         q = `Transforme ${dec} en pourcentage`;
         answer = `${p}%`;
         astuce = `Multiplie par 100 pour l'avoir en pourcent.`;
         options = [answer, `${p/10}%`, `${p*10}%`, `${p+10}%`];
      }
      break;
    }
    case 'arrondis': {
      const e = rand(10, 99);
      const d = rand(1, 9);
      const isUp = d >= 5;
      q = `Arrondis ${e},${d} à l'unité`;
      answer = isUp ? String(e + 1) : String(e);
      astuce = isUp ? `Le dixième est ${d} (≥ 5), on arrondit au-dessus.` : `Le dixième est ${d} (< 5), on garde l'unité.`;
      options = [answer, String(e), String(e+1), `${e},5`];
      break;
    }
    case 'conversions': {
      const v = rand(1, 9) * Math.pow(10, rand(0, 1)); // 1 à 90
      const steps = [
         {f:'km', t:'m', m:1000},
         {f:'m', t:'cm', m:100},
         {f:'cm', t:'mm', m:10},
         {f:'kg', t:'g', m:1000},
         {f:'L', t:'cL', m:100},
         {f:'m', t:'mm', m:1000}
      ];
      const p = randEl(steps);
      const toBigger = Math.random() > 0.5; // ex: 1000m -> 1km
      
      if (toBigger) {
         const bigV = v * p.m;
         q = `Convertis : ${bigV} ${p.t} = ... ${p.f}`;
         answer = String(v);
         astuce = `Rappelle-toi : 1 ${p.f} = ${p.m} ${p.t}, donc on divise par ${p.m}.`;
         options = [answer, String(v*10), String(v/10), String((v*p.m)/10)];
      } else {
         q = `Convertis : ${v} ${p.f} = ... ${p.t}`;
         answer = String(v * p.m);
         astuce = `Rappelle-toi : 1 ${p.f} = ${p.m} ${p.t}, donc on multiplie par ${p.m}.`;
         options = [answer, String(v * (p.m/10)), String(v * (p.m*10)), String(v * p.m + 10)];
      }
      break;
    }
    case 'mult10': {
      const v = rand(2, 45);
      let m;
      if (currentQ <= 5) m = 10;
      else if (currentQ <= 10) m = 100;
      else m = 1000;
      
      q = `${v} x ${m} = ?`;
      answer = String(v * m);
      astuce = `C'est une multiplication : ajoute autant de zéros qu'il y en a dans ${m}.`;
      options = [answer, String(v * (m/10)), String(v * (m*10)), String(v + m)];
      break;
    }
    case 'div10': {
      let m;
      if (currentQ <= 5) m = 10;
      else if (currentQ <= 10) m = 100;
      else m = 1000;
      
      const v = rand(2, 45) * m;
      
      q = `${v} ÷ ${m} = ?`;
      answer = String(v / m);
      astuce = `C'est une division : barre autant de zéros qu'il y en a dans ${m}.`;
      options = [answer, String((v / m)*10), String((v / m)/10), String(v - m)];
      break;
    }
    default: {
      const a = rand(1, 10);
      const b = rand(1, 10);
      q = `${a} + ${b} = ?`;
      answer = a + b;
      astuce = "Calcule calmement.";
      break;
    }
  }

  // --- BUILD OPTIONS SAFELY ---
  let finalAnsString = String(answer);

  // If no explicit options provided by the case, auto-generate standard numeric options
  if (options.length === 0) {
     let numAns = parseFloat(finalAnsString.replace(',', '.'));
     if(!isNaN(numAns)) {
       options = [
         finalAnsString,
         String(numAns + rand(1, 4)).replace('.', ','),
         String(numAns - rand(1, 3)).replace('.', ','),
         String(numAns + 10).replace('.', ',')
       ];
     } else {
       options = [finalAnsString, finalAnsString+"!", "?" , "Autre"];
     }
  }

  // Ensure options are unique 
  let finalOptionsSet = new Set(options.map(String));
  
  // Fill up to 4 if there were duplicates
  let fallbackCount = 1;
  while(finalOptionsSet.size < 4 && fallbackCount < 20) {
     let numAns = parseFloat(finalAnsString.replace(',', '.'));
     if(!isNaN(numAns)) {
        finalOptionsSet.add(String(numAns + fallbackCount).replace('.', ','));
     } else {
        finalOptionsSet.add(`Faux ${fallbackCount}`);
     }
     fallbackCount++;
  }

  let finalOptionsArray = Array.from(finalOptionsSet).slice(0, 4);

  // Shuffle array
  for (let i = finalOptionsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalOptionsArray[i], finalOptionsArray[j]] = [finalOptionsArray[j], finalOptionsArray[i]];
  }

  return { 
     question: q, 
     answer: finalAnsString, 
     options: finalOptionsArray, 
     astuce 
  };
}
