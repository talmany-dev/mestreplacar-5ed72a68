export interface Match {
  id: string;
  home: string;
  homeFlag: string;
  away: string;
  awayFlag: string;
  date: string;
  time: string;
  group: string;
  round: number;
  locked: boolean;
  bet?: { home: number; away: number };
  golden?: boolean;
}

const FLAGS: Record<string, string> = {
  "México": "mx",
  "África do Sul": "za",
  "Coréia do Sul": "kr",
  "Europa 4": "eu",
  "Canadá": "ca",
  "Europa 1": "eu",
  "Catar": "qa",
  "Suíça": "ch",
  "Brasil": "br",
  "Marrocos": "ma",
  "Haiti": "ht",
  "Escócia": "gb-sct",
  "Estados Unidos": "us",
  "Paraguai": "py",
  "Austrália": "au",
  "Europa 3": "eu",
  "Alemanha": "de",
  "Curaçao": "cw",
  "Costa do Marfim": "ci",
  "Equador": "ec",
  "Holanda": "nl",
  "Japão": "jp",
  "Europa 2": "eu",
  "Tunísia": "tn",
  "Bélgica": "be",
  "Egito": "eg",
  "Irã": "ir",
  "Nova Zelândia": "nz",
  "Espanha": "es",
  "Cabo Verde": "cv",
  "Arábia Saudita": "sa",
  "Uruguai": "uy",
  "França": "fr",
  "Senegal": "sn",
  "Intercontinental 2": "un",
  "Noruega": "no",
  "Áustria": "at",
  "Jordânia": "jo",
  "Argentina": "ar",
  "Argélia": "dz",
  "Portugal": "pt",
  "Intercontinental 1": "un",
  "Uzbequistão": "uz",
  "Colômbia": "co",
  "Inglaterra": "gb-eng",
  "Croácia": "hr",
  "Gana": "gh",
  "Panamá": "pa",
};

export function getFlagUrl(code: string, size: number = 40): string {
  return `https://flagcdn.com/w${size}/${code}.png`;
}

function flag(team: string): string {
  return FLAGS[team] || "🏳️";
}

function makeMatch(id: number, dateTime: string, home: string, away: string, group: string, round: number): Match {
  const [datePart, timePart] = dateTime.split(" - ");
  const [day, month] = datePart.split("/");
  const months = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const dateStr = `${parseInt(day)} ${months[parseInt(month)]}`;
  return {
    id: String(id),
    home,
    homeFlag: flag(home),
    away,
    awayFlag: flag(away),
    date: dateStr,
    time: timePart,
    group,
    round,
    locked: false,
  };
}

let id = 1;

export const GROUP_MATCHES: Match[] = [
  // GRUPO A - Rodada 1
  makeMatch(id++, "11/06/2026 - 16:00", "México", "África do Sul", "A", 1),
  makeMatch(id++, "11/06/2026 - 23:00", "Coréia do Sul", "Europa 4", "A", 1),
  // GRUPO A - Rodada 2
  makeMatch(id++, "18/06/2026 - 13:00", "Europa 4", "África do Sul", "A", 2),
  makeMatch(id++, "18/06/2026 - 22:00", "México", "Coréia do Sul", "A", 2),
  // GRUPO A - Rodada 3
  makeMatch(id++, "24/06/2026 - 22:00", "Europa 4", "México", "A", 3),
  makeMatch(id++, "24/06/2026 - 22:00", "África do Sul", "Coréia do Sul", "A", 3),

  // GRUPO B - Rodada 1
  makeMatch(id++, "12/06/2026 - 16:00", "Canadá", "Europa 1", "B", 1),
  makeMatch(id++, "13/06/2026 - 16:00", "Catar", "Suíça", "B", 1),
  // GRUPO B - Rodada 2
  makeMatch(id++, "18/06/2026 - 16:00", "Suíça", "Europa 1", "B", 2),
  makeMatch(id++, "18/06/2026 - 19:00", "Canadá", "Catar", "B", 2),
  // GRUPO B - Rodada 3
  makeMatch(id++, "24/06/2026 - 16:00", "Suíça", "Canadá", "B", 3),
  makeMatch(id++, "24/06/2026 - 16:00", "Europa 1", "Catar", "B", 3),

  // GRUPO C - Rodada 1
  makeMatch(id++, "13/06/2026 - 19:00", "Brasil", "Marrocos", "C", 1),
  makeMatch(id++, "13/06/2026 - 22:00", "Haiti", "Escócia", "C", 1),
  // GRUPO C - Rodada 2
  makeMatch(id++, "19/06/2026 - 19:00", "Escócia", "Marrocos", "C", 2),
  makeMatch(id++, "19/06/2026 - 22:00", "Brasil", "Haiti", "C", 2),
  // GRUPO C - Rodada 3
  makeMatch(id++, "24/06/2026 - 19:00", "Escócia", "Brasil", "C", 3),
  makeMatch(id++, "24/06/2026 - 19:00", "Marrocos", "Haiti", "C", 3),

  // GRUPO D - Rodada 1
  makeMatch(id++, "12/06/2026 - 22:00", "Estados Unidos", "Paraguai", "D", 1),
  makeMatch(id++, "14/06/2026 - 01:00", "Austrália", "Europa 3", "D", 1),
  // GRUPO D - Rodada 2
  makeMatch(id++, "20/06/2026 - 01:00", "Europa 3", "Paraguai", "D", 2),
  makeMatch(id++, "19/06/2026 - 16:00", "Estados Unidos", "Austrália", "D", 2),
  // GRUPO D - Rodada 3
  makeMatch(id++, "25/06/2026 - 23:00", "Europa 3", "Estados Unidos", "D", 3),
  makeMatch(id++, "25/06/2026 - 23:00", "Paraguai", "Austrália", "D", 3),

  // GRUPO E - Rodada 1
  makeMatch(id++, "14/06/2026 - 14:00", "Alemanha", "Curaçao", "E", 1),
  makeMatch(id++, "14/06/2026 - 20:00", "Costa do Marfim", "Equador", "E", 1),
  // GRUPO E - Rodada 2
  makeMatch(id++, "20/06/2026 - 17:00", "Alemanha", "Costa do Marfim", "E", 2),
  makeMatch(id++, "20/06/2026 - 21:00", "Equador", "Curaçao", "E", 2),
  // GRUPO E - Rodada 3
  makeMatch(id++, "25/06/2026 - 17:00", "Equador", "Alemanha", "E", 3),
  makeMatch(id++, "25/06/2026 - 17:00", "Curaçao", "Costa do Marfim", "E", 3),

  // GRUPO F - Rodada 1
  makeMatch(id++, "14/06/2026 - 17:00", "Holanda", "Japão", "F", 1),
  makeMatch(id++, "14/06/2026 - 23:00", "Europa 2", "Tunísia", "F", 1),
  // GRUPO F - Rodada 2
  makeMatch(id++, "21/06/2026 - 01:00", "Tunísia", "Japão", "F", 2),
  makeMatch(id++, "20/06/2026 - 14:00", "Holanda", "Europa 2", "F", 2),
  // GRUPO F - Rodada 3
  makeMatch(id++, "25/06/2026 - 20:00", "Japão", "Europa 2", "F", 3),
  makeMatch(id++, "25/06/2026 - 20:00", "Tunísia", "Holanda", "F", 3),

  // GRUPO G - Rodada 1
  makeMatch(id++, "15/06/2026 - 16:00", "Bélgica", "Egito", "G", 1),
  makeMatch(id++, "15/06/2026 - 22:00", "Irã", "Nova Zelândia", "G", 1),
  // GRUPO G - Rodada 2
  makeMatch(id++, "21/06/2026 - 16:00", "Bélgica", "Irã", "G", 2),
  makeMatch(id++, "21/06/2026 - 22:00", "Nova Zelândia", "Egito", "G", 2),
  // GRUPO G - Rodada 3
  makeMatch(id++, "27/06/2026 - 00:00", "Egito", "Irã", "G", 3),
  makeMatch(id++, "27/06/2026 - 00:00", "Nova Zelândia", "Bélgica", "G", 3),

  // GRUPO H - Rodada 1
  makeMatch(id++, "15/06/2026 - 13:00", "Espanha", "Cabo Verde", "H", 1),
  makeMatch(id++, "15/06/2026 - 19:00", "Arábia Saudita", "Uruguai", "H", 1),
  // GRUPO H - Rodada 2
  makeMatch(id++, "21/06/2026 - 13:00", "Espanha", "Arábia Saudita", "H", 2),
  makeMatch(id++, "21/06/2026 - 19:00", "Uruguai", "Cabo Verde", "H", 2),
  // GRUPO H - Rodada 3
  makeMatch(id++, "26/06/2026 - 21:00", "Cabo Verde", "Arábia Saudita", "H", 3),
  makeMatch(id++, "26/06/2026 - 21:00", "Uruguai", "Espanha", "H", 3),

  // GRUPO I - Rodada 1
  makeMatch(id++, "16/06/2026 - 16:00", "França", "Senegal", "I", 1),
  makeMatch(id++, "16/06/2026 - 19:00", "Intercontinental 2", "Noruega", "I", 1),
  // GRUPO I - Rodada 2
  makeMatch(id++, "22/06/2026 - 18:00", "França", "Intercontinental 2", "I", 2),
  makeMatch(id++, "22/06/2026 - 21:00", "Noruega", "Senegal", "I", 2),
  // GRUPO I - Rodada 3
  makeMatch(id++, "26/06/2026 - 16:00", "Noruega", "França", "I", 3),
  makeMatch(id++, "26/06/2026 - 16:00", "Senegal", "Intercontinental 2", "I", 3),

  // GRUPO J - Rodada 1
  makeMatch(id++, "17/06/2026 - 01:00", "Áustria", "Jordânia", "J", 1),
  makeMatch(id++, "16/06/2026 - 22:00", "Argentina", "Argélia", "J", 1),
  // GRUPO J - Rodada 2
  makeMatch(id++, "22/06/2026 - 14:00", "Argentina", "Áustria", "J", 2),
  makeMatch(id++, "23/06/2026 - 00:00", "Jordânia", "Argélia", "J", 2),
  // GRUPO J - Rodada 3
  makeMatch(id++, "27/06/2026 - 23:00", "Argélia", "Áustria", "J", 3),
  makeMatch(id++, "27/06/2026 - 23:00", "Jordânia", "Argentina", "J", 3),

  // GRUPO K - Rodada 1
  makeMatch(id++, "17/06/2026 - 14:00", "Portugal", "Intercontinental 1", "K", 1),
  makeMatch(id++, "17/06/2026 - 23:00", "Uzbequistão", "Colômbia", "K", 1),
  // GRUPO K - Rodada 2
  makeMatch(id++, "23/06/2026 - 14:00", "Portugal", "Uzbequistão", "K", 2),
  makeMatch(id++, "23/06/2026 - 23:00", "Colômbia", "Intercontinental 1", "K", 2),
  // GRUPO K - Rodada 3
  makeMatch(id++, "27/06/2026 - 20:30", "Colômbia", "Portugal", "K", 3),
  makeMatch(id++, "27/06/2026 - 20:30", "Intercontinental 1", "Uzbequistão", "K", 3),

  // GRUPO L - Rodada 1
  makeMatch(id++, "17/06/2026 - 17:00", "Inglaterra", "Croácia", "L", 1),
  makeMatch(id++, "17/06/2026 - 20:00", "Gana", "Panamá", "L", 1),
  // GRUPO L - Rodada 2
  makeMatch(id++, "23/06/2026 - 17:00", "Inglaterra", "Gana", "L", 2),
  makeMatch(id++, "23/06/2026 - 20:00", "Panamá", "Croácia", "L", 2),
  // GRUPO L - Rodada 3
  makeMatch(id++, "27/06/2026 - 18:00", "Panamá", "Inglaterra", "L", 3),
  makeMatch(id++, "27/06/2026 - 18:00", "Croácia", "Gana", "L", 3),
];
