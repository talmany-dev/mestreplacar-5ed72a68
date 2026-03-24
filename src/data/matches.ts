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
  "México": "🇲🇽",
  "África do Sul": "🇿🇦",
  "Coréia do Sul": "🇰🇷",
  "Europa 4": "🇪🇺",
  "Canadá": "🇨🇦",
  "Europa 1": "🇪🇺",
  "Catar": "🇶🇦",
  "Suíça": "🇨🇭",
  "Brasil": "🇧🇷",
  "Marrocos": "🇲🇦",
  "Haiti": "🇭🇹",
  "Escócia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Estados Unidos": "🇺🇸",
  "Paraguai": "🇵🇾",
  "Austrália": "🇦🇺",
  "Europa 3": "🇪🇺",
  "Alemanha": "🇩🇪",
  "Curaçao": "🇨🇼",
  "Costa do Marfim": "🇨🇮",
  "Equador": "🇪🇨",
  "Holanda": "🇳🇱",
  "Japão": "🇯🇵",
  "Europa 2": "🇪🇺",
  "Tunísia": "🇹🇳",
  "Bélgica": "🇧🇪",
  "Egito": "🇪🇬",
  "Irã": "🇮🇷",
  "Nova Zelândia": "🇳🇿",
  "Espanha": "🇪🇸",
  "Cabo Verde": "🇨🇻",
  "Arábia Saudita": "🇸🇦",
  "Uruguai": "🇺🇾",
  "França": "🇫🇷",
  "Senegal": "🇸🇳",
  "Intercontinental 2": "🌍",
  "Noruega": "🇳🇴",
  "Áustria": "🇦🇹",
  "Jordânia": "🇯🇴",
  "Argentina": "🇦🇷",
  "Argélia": "🇩🇿",
  "Portugal": "🇵🇹",
  "Intercontinental 1": "🌍",
  "Uzbequistão": "🇺🇿",
  "Colômbia": "🇨🇴",
  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Croácia": "🇭🇷",
  "Gana": "🇬🇭",
  "Panamá": "🇵🇦",
};

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
  // GRUPO A
  makeMatch(id++, "11/06/2026 - 16:00", "México", "África do Sul", "A"),
  makeMatch(id++, "11/06/2026 - 23:00", "Coréia do Sul", "Europa 4", "A"),
  makeMatch(id++, "18/06/2026 - 13:00", "Europa 4", "África do Sul", "A"),
  makeMatch(id++, "18/06/2026 - 22:00", "México", "Coréia do Sul", "A"),
  makeMatch(id++, "24/06/2026 - 22:00", "Europa 4", "México", "A"),
  makeMatch(id++, "24/06/2026 - 22:00", "África do Sul", "Coréia do Sul", "A"),

  // GRUPO B
  makeMatch(id++, "12/06/2026 - 16:00", "Canadá", "Europa 1", "B"),
  makeMatch(id++, "13/06/2026 - 16:00", "Catar", "Suíça", "B"),
  makeMatch(id++, "18/06/2026 - 16:00", "Suíça", "Europa 1", "B"),
  makeMatch(id++, "18/06/2026 - 19:00", "Canadá", "Catar", "B"),
  makeMatch(id++, "24/06/2026 - 16:00", "Suíça", "Canadá", "B"),
  makeMatch(id++, "24/06/2026 - 16:00", "Europa 1", "Catar", "B"),

  // GRUPO C
  makeMatch(id++, "13/06/2026 - 19:00", "Brasil", "Marrocos", "C"),
  makeMatch(id++, "13/06/2026 - 22:00", "Haiti", "Escócia", "C"),
  makeMatch(id++, "19/06/2026 - 19:00", "Escócia", "Marrocos", "C"),
  makeMatch(id++, "19/06/2026 - 22:00", "Brasil", "Haiti", "C"),
  makeMatch(id++, "24/06/2026 - 19:00", "Escócia", "Brasil", "C"),
  makeMatch(id++, "24/06/2026 - 19:00", "Marrocos", "Haiti", "C"),

  // GRUPO D
  makeMatch(id++, "12/06/2026 - 22:00", "Estados Unidos", "Paraguai", "D"),
  makeMatch(id++, "14/06/2026 - 01:00", "Austrália", "Europa 3", "D"),
  makeMatch(id++, "20/06/2026 - 01:00", "Europa 3", "Paraguai", "D"),
  makeMatch(id++, "19/06/2026 - 16:00", "Estados Unidos", "Austrália", "D"),
  makeMatch(id++, "25/06/2026 - 23:00", "Europa 3", "Estados Unidos", "D"),
  makeMatch(id++, "25/06/2026 - 23:00", "Paraguai", "Austrália", "D"),

  // GRUPO E
  makeMatch(id++, "14/06/2026 - 14:00", "Alemanha", "Curaçao", "E"),
  makeMatch(id++, "14/06/2026 - 20:00", "Costa do Marfim", "Equador", "E"),
  makeMatch(id++, "20/06/2026 - 17:00", "Alemanha", "Costa do Marfim", "E"),
  makeMatch(id++, "20/06/2026 - 21:00", "Equador", "Curaçao", "E"),
  makeMatch(id++, "25/06/2026 - 17:00", "Equador", "Alemanha", "E"),
  makeMatch(id++, "25/06/2026 - 17:00", "Curaçao", "Costa do Marfim", "E"),

  // GRUPO F
  makeMatch(id++, "14/06/2026 - 17:00", "Holanda", "Japão", "F"),
  makeMatch(id++, "14/06/2026 - 23:00", "Europa 2", "Tunísia", "F"),
  makeMatch(id++, "21/06/2026 - 01:00", "Tunísia", "Japão", "F"),
  makeMatch(id++, "20/06/2026 - 14:00", "Holanda", "Europa 2", "F"),
  makeMatch(id++, "25/06/2026 - 20:00", "Japão", "Europa 2", "F"),
  makeMatch(id++, "25/06/2026 - 20:00", "Tunísia", "Holanda", "F"),

  // GRUPO G
  makeMatch(id++, "15/06/2026 - 16:00", "Bélgica", "Egito", "G"),
  makeMatch(id++, "15/06/2026 - 22:00", "Irã", "Nova Zelândia", "G"),
  makeMatch(id++, "21/06/2026 - 16:00", "Bélgica", "Irã", "G"),
  makeMatch(id++, "21/06/2026 - 22:00", "Nova Zelândia", "Egito", "G"),
  makeMatch(id++, "27/06/2026 - 00:00", "Egito", "Irã", "G"),
  makeMatch(id++, "27/06/2026 - 00:00", "Nova Zelândia", "Bélgica", "G"),

  // GRUPO H
  makeMatch(id++, "15/06/2026 - 13:00", "Espanha", "Cabo Verde", "H"),
  makeMatch(id++, "15/06/2026 - 19:00", "Arábia Saudita", "Uruguai", "H"),
  makeMatch(id++, "21/06/2026 - 13:00", "Espanha", "Arábia Saudita", "H"),
  makeMatch(id++, "21/06/2026 - 19:00", "Uruguai", "Cabo Verde", "H"),
  makeMatch(id++, "26/06/2026 - 21:00", "Cabo Verde", "Arábia Saudita", "H"),
  makeMatch(id++, "26/06/2026 - 21:00", "Uruguai", "Espanha", "H"),

  // GRUPO I
  makeMatch(id++, "16/06/2026 - 16:00", "França", "Senegal", "I"),
  makeMatch(id++, "16/06/2026 - 19:00", "Intercontinental 2", "Noruega", "I"),
  makeMatch(id++, "22/06/2026 - 18:00", "França", "Intercontinental 2", "I"),
  makeMatch(id++, "22/06/2026 - 21:00", "Noruega", "Senegal", "I"),
  makeMatch(id++, "26/06/2026 - 16:00", "Noruega", "França", "I"),
  makeMatch(id++, "26/06/2026 - 16:00", "Senegal", "Intercontinental 2", "I"),

  // GRUPO J
  makeMatch(id++, "17/06/2026 - 01:00", "Áustria", "Jordânia", "J"),
  makeMatch(id++, "16/06/2026 - 22:00", "Argentina", "Argélia", "J"),
  makeMatch(id++, "22/06/2026 - 14:00", "Argentina", "Áustria", "J"),
  makeMatch(id++, "23/06/2026 - 00:00", "Jordânia", "Argélia", "J"),
  makeMatch(id++, "27/06/2026 - 23:00", "Argélia", "Áustria", "J"),
  makeMatch(id++, "27/06/2026 - 23:00", "Jordânia", "Argentina", "J"),

  // GRUPO K
  makeMatch(id++, "17/06/2026 - 14:00", "Portugal", "Intercontinental 1", "K"),
  makeMatch(id++, "17/06/2026 - 23:00", "Uzbequistão", "Colômbia", "K"),
  makeMatch(id++, "23/06/2026 - 14:00", "Portugal", "Uzbequistão", "K"),
  makeMatch(id++, "23/06/2026 - 23:00", "Colômbia", "Intercontinental 1", "K"),
  makeMatch(id++, "27/06/2026 - 20:30", "Colômbia", "Portugal", "K"),
  makeMatch(id++, "27/06/2026 - 20:30", "Intercontinental 1", "Uzbequistão", "K"),

  // GRUPO L
  makeMatch(id++, "17/06/2026 - 17:00", "Inglaterra", "Croácia", "L"),
  makeMatch(id++, "17/06/2026 - 20:00", "Gana", "Panamá", "L"),
  makeMatch(id++, "23/06/2026 - 17:00", "Inglaterra", "Gana", "L"),
  makeMatch(id++, "23/06/2026 - 20:00", "Panamá", "Croácia", "L"),
  makeMatch(id++, "27/06/2026 - 18:00", "Panamá", "Inglaterra", "L"),
  makeMatch(id++, "27/06/2026 - 18:00", "Croácia", "Gana", "L"),
];
