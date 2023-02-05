export function score(game: number[]) {
  return recursiveScore(game);
}

const recursiveScore = (remainingRolls: number[], frameIndex = 0) => {
  if (frameIndex === 10) return 0;

  const [firstRoll, secondRoll, ...nextFrames] = remainingRolls;
  const [followingRoll] = nextFrames;
  const frame = firstRoll + (secondRoll ?? 0);

  if (firstRoll === 10)
    return (
      firstRoll +
      secondRoll +
      followingRoll +
      recursiveScore([secondRoll, ...nextFrames], frameIndex + 1)
    );

  if (frame === 10)
    return frame + followingRoll + recursiveScore(nextFrames, frameIndex + 1);

  return frame + recursiveScore(nextFrames, frameIndex + 1);
};
