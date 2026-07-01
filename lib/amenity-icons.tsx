import { cloneElement } from "react";
import type { ReactElement } from "react";
import {
  FaBaby,
  FaBoxOpen,
  FaBuilding,
  FaCocktail,
  FaCoffee,
  FaDumbbell,
  FaGamepad,
  FaHeart,
  FaHome,
  FaMapMarkedAlt,
  FaMoon,
  FaStore,
  FaSun,
  FaTree,
  FaTrophy,
  FaUsb,
  FaUtensils,
  FaWineGlassAlt,
} from "react-icons/fa";
import { FaPersonWalking } from "react-icons/fa6";
import { GiBarbecue } from "react-icons/gi";
import { LuCakeSlice, LuPopcorn } from "react-icons/lu";
import { MdOutlinePool } from "react-icons/md";
import { PiSoccerBallFill } from "react-icons/pi";
import {
  TbBeach,
  TbBuildingCommunity,
  TbCarGarage,
  TbDeviceCctv,
  TbDog,
  TbElevator,
  TbFlower,
  TbHomeHeart,
  TbMapPin,
  TbPlayFootball,
  TbPlayVolleyball,
  TbRulerMeasure,
  TbSchool,
  TbShieldCheck,
  TbSoccerField,
  TbSparkles,
  TbToolsKitchen2,
  TbTrees,
  TbWashMachine,
} from "react-icons/tb";

type AmenityIconElement = ReactElement<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

const amenityIconMatchers: Array<[string[], AmenityIconElement]> = [
  // Aquatic and wellness
  [["piscina", "pool"], <MdOutlinePool />],
  [["deck molhado"], <FaSun />],
  [["sauna", "spa", "descanso"], <TbSparkles />],
  [["solario", "solário", "solarium"], <FaSun />],

  // Food and social
  [["churrasqueira", "churrasqueiras", "apoio churras", "apoio churrasqueira"], <GiBarbecue />],
  [["espaco gourmet", "espaço gourmet", "gourmet", "goumert", "salão goumert", "drink gourmet"], <FaUtensils />],
  [["apoio festas", "salao de festas", "salão de festas", "festas"], <LuCakeSlice />],
  [["bar piscina", "bar praia", "sky bar", "sport bar", "sports bar", "sportbar", "lounge bar", "bar"], <FaWineGlassAlt />],
  [["cafeteria"], <FaCoffee />],
  [["food square", "food truck", "espaco alimentacao", "espaço alimentação"], <FaUtensils />],
  [["easy market", "easymarket", "mercadinho"], <FaStore />],
  [["delivery", "sala delivery"], <FaBoxOpen />],

  // Fitness and sports
  [["academia c/ spinning", "academia", "fitness", "crossfit", "spinning", "pilates", "sala de ginastica", "sala de ginástica"], <FaDumbbell />],
  [["academia externa", "fitness externo", "fitness ao ar livre", "caminhada", "pista de caminhada", "pista caminhada", "pista de cooper"], <FaPersonWalking />],
  [["beach tenis", "beach tênis", "beach tennis", "beach tênnis"], <TbBeach />],
  [["quadra", "mini quadra", "miniquadra", "mini-quadra", "quadra poliesportiva", "quadra sintética", "quadra gramada", "quadra grama", "streetball"], <TbSoccerField />],
  [["campo de futebol", "campo society", "campo esportivo", "campo gramado", "campinho", "chute a gol"], <TbPlayFootball />],
  [["futmesa", "futebol de mesa", "ping pong", "ping-pong"], <PiSoccerBallFill />],
  [["volei", "vôlei"], <TbPlayVolleyball />],

  // Kids, pets and games
  [["playground", "playzone", "apoio playground"], <FaTrophy />],
  [["play baby", "playbaby", "baby place"], <FaBaby />],
  [["brinquedoteca", "brinquetodeca", "espaco infantil", "espaço infantil", "espaco kids", "espaço kids"], <FaGamepad />],
  [["pet place", "petplace", "pet care", "petcare", "estar pet", "espaco pet", "espaço pet"], <TbDog />],
  [["sala de jogos", "salao de jogos", "salão de jogos", "jogos", "games", "sala games", "pub", "pub/jogos", "pub e jogos", "pub com jogos", "lounge de jogos", "estacao cinema"], <FaGamepad />],
  [["cine", "cinema", "cine open air", "estação cinema"], <LuPopcorn />],

  // Work and utility
  [["coworking", "cooworking", "office space", "home office", "espaco escritorio", "espaço escritório"], <FaBuilding />],
  [["lavanderia"], <TbWashMachine />],
  [["armario inteligente", "armário inteligente"], <FaBoxOpen />],
  [["bicicletario", "bicicletário", "bike oficina", "oficina", "oficina compartilhada"], <TbTrees />],
  [["elevador"], <TbElevator />],
  [["tomada usb"], <FaUsb />],
  [["medicao individualizada", "medição individualizada", "duplo acionamento no vaso sanitario", "duplo acionamento no vaso sanitário"], <TbRulerMeasure />],
  [["cftv", "camera", "câmera"], <TbDeviceCctv />],

  // Leisure and contemplative
  [["area de convivencia", "área de convivência", "espaco convivencia", "espaço convivência", "praca de convivencia", "praça de convivência", "praca central", "praça central", "praças", "praça"], <FaHeart />],
  [["piquenique", "pique-nique", "picnic", "area de piquenique", "área de piquenique", "praca do piquenique", "praça do piquenique", "praça de piquenique"], <FaTree />],
  [["bosque", "jardim", "pomar", "horta", "horta e pomar"], <TbFlower />],
  [["redario", "redário", "pergolado", "pergolado zen", "pergolado jogos", "lounge zen", "espaco zen", "espaço zen", "espaco meditação", "espaço meditação", "espaco yoga", "espaço yoga", "praça do yoga"], <FaMoon />],
  [["rooftop", "happy hour sky"], <FaBuilding />],
  [["lounge", "luau", "praça do lual", "praça luau"], <TbSparkles />],
  [["estar", "estar de leitura", "espaco leitura", "espaço leitura", "praça de leitura", "praça leitura"], <FaHome />],

  // Misc spaces
  [["atelier", "ateliê"], <FaBuilding />],
  [["beauty care", "espaco beleza", "espaço beleza", "espaco mulher", "espaço mulher", "salao de beleza", "salão de beleza"], <TbSparkles />],
  [["cozinha"], <TbToolsKitchen2 />],
  [["wine lounge"], <FaCocktail />],
  [["live", "multiuso", "espaço flex"], <TbBuildingCommunity />],
  [["agility"], <FaMapMarkedAlt />],
  [["proximo ao metro", "próximo ao metrô", "metro", "metrô", "mobilidade"], <TbMapPin />],
  [["proximo a escola", "próximo à escola", "escola"], <TbSchool />],
  [["portaria", "seguranca", "segurança", "monitoramento"], <TbShieldCheck />],
  [["garagem", "vaga", "estacionamento"], <TbCarGarage />],
  [["varanda", "terraco", "terraço", "sacada"], <TbHomeHeart />],
];

function normalizeAmenityLabel(label: string) {
  return label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getAmenityIcon(label: string) {
  const normalizedLabel = normalizeAmenityLabel(label);
  const icon =
    amenityIconMatchers.find(([terms]) =>
      terms.some((term) => normalizedLabel.includes(normalizeAmenityLabel(term)))
    )?.[1] ?? null;

  if (!icon) {
    return null;
  }

  return cloneElement(icon, {
    className: "size-4 shrink-0 text-accent-soft",
    "aria-hidden": true,
  });
}
