import { calculateSimulationScore } from "../engine/scoreCalculator";
import { buildScenarioResult } from "../engine/scenarioBuilder";

export async function runSmartfarmSimulation(form) {
  const scoreData = calculateSimulationScore(form);
  const result = buildScenarioResult(form, scoreData);

  return Promise.resolve(result);
}