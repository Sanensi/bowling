import { score } from "./bowling";

describe("A simple game of bowling is one that has no strike or spare", () => {
  describe("The score of a simple game is the total number of pins knocked down", () => {
    test("When no pins are knocked, then the score is 0", () => {
      const game = completeGameWith(0);

      expect(score(game)).toBe(0);
    });

    test("When 1 pin is knocked on every roll, then the score is 20", () => {
      const game = completeGameWith(1);

      expect(score(game)).toBe(20);
    });

    test("When 9 pins are knocked down on the first two frames, then the score is 18", () => {
      const game = complete([9, 0, 4, 5]).with(0);

      expect(score(game)).toBe(18);
    });
  });
});

describe("A spare is when 10 pins are knocked down in the same frame", () => {
  describe("The score of the frame if it is a spare is of 10 plus the number of pins knocked down on the following roll", () => {
    test("When rolling a spare and all subsequent rolls are 0, then the score is 10", () => {
      const game = complete([9, 1]).with(0);

      expect(score(game)).toBe(10);
    });

    test("When rolling a spare and the following roll is 1, then the score is (10 + 1) + 1", () => {
      const game = complete([5, 5, 1, 0]).with(0);

      expect(score(game)).toBe(12);
    });

    test("When rolling a spare followed by a 9 and a 1, then the score is (10 + 9) + (9 + 1)", () => {
      const game = complete([3, 7, 9, 1]).with(0);

      expect(score(game)).toBe(29);
    });
  });

  describe("The score of the last frame of the game if it is a spare is of 10 plus the number of pins knocked down in a single bonus throw", () => {
    test("When rolling a spare on the last frame of the game followed by a bonus roll of 7, then the score is of (10 + 7)", () => {
      const game = beginGameWith(18, 0).followedBy([9, 1, 7]);

      expect(score(game)).toBe(17);
    });
  });
});

describe("A strike is when the 10 pins are knocked down on the first roll of a frame", () => {
  describe("The score of the frame when rolling a strike is of 10 plus the number of pins knocked down on the following 2 rolls", () => {
    test("When rolling a strike and all subsequent rolls are 0, then the score is 10", () => {
      const game = complete([10]).with(0);

      expect(score(game)).toBe(10);
    });

    test("When rolling a strike and all subsequent rolls are 1, then the score is (10 + 1 + 1) + 18 * (1)", () => {
      const game = complete([10]).with(1);

      expect(score(game)).toBe(30);
    });
  });

  describe("The score of the last frame of the game if it is a strike is of 10 plus the number of pins knocked down in the following 2 bonus throws", () => {
    test("When rolling a strike on the last frame of the game followed by two bonus roll of 3 and 7, then the score is of (10 + 3 + 7)", () => {
      const game = beginGameWith(18, 0).followedBy([10, 3, 7]);

      expect(score(game)).toBe(20);
    });

    test("When rolling a perfect game, then the score is 300", () => {
      const game = rollMany(12, 10);

      expect(score(game)).toBe(300);
    });
  });
});

function rollMany(numberOfRolls: number, pinsPerRoll: number) {
  return Array.from({ length: numberOfRolls }, () => pinsPerRoll);
}

function completeGameWith(pinsPerRoll: number, game: number[] = []) {
  const numberOfStrikes = game.filter((pins) => pins === 10).length;
  const remainingRolls = 20 - game.length - numberOfStrikes;

  return [...game, ...rollMany(remainingRolls, pinsPerRoll)];
}

const complete = (game: number[]) => ({
  with: (pinsPerRoll: number) => completeGameWith(pinsPerRoll, game),
});

const beginGameWith = (numberOfRolls: number, pinsPerRoll: number) => ({
  followedBy: (restOfGame: number[]) => [
    ...rollMany(numberOfRolls, pinsPerRoll),
    ...restOfGame,
  ],
});
