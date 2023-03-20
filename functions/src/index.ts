import * as functions from 'firebase-functions';
import Scrimmage, {
  Bet,
  BetLeague,
  BetOutcome,
  BetSport,
  BetType,
  SingleBet,
  SingleBetType,
} from 'scrimmage-rewards';
import {defineInt, defineString} from 'firebase-functions/params';

const SCRIMMAGE_PRIVATE_KEY = defineString('SCRIMMAGE_PRIVATE_KEY');
const SCRIMMAGE_REWARDER_ID = defineInt('SCRIMMAGE_REWARDER_ID');

const init = () => {
  Scrimmage.initRewarder({
    rewarderId: SCRIMMAGE_REWARDER_ID.value(),
    privateKey: SCRIMMAGE_PRIVATE_KEY.value(),
    // baseUrl: 'https://staging-app.scrimmage.co/api', // redefine URL for testing
    // loginUrl: 'https://rewards.scrimmage.co/integrate?', // redefine URL for testing
  } as any);
};

export const generateIntegrationInfo =
  functions.https.onCall(async (data, context) => {
    init();
    functions.logger.info('generateIntegrationInfo');

    return {
      loginURL: Scrimmage.user.generateLoginLink(String(context.auth?.uid)),
      bannerURL: Scrimmage
          .promotion
          .getWidget(
              String(context.auth?.uid),
              data.averageEarning,
              'banner4',
          ),
    };
  });

export const userWonBet =
  functions.https.onCall(async (data, context) => {
    init();
    functions.logger.info('userWonBet', data);

    // {"id":"CC98CF72-7FEC-4B39-9932-9A7F2C6FF042","league":"NCAAF","sport":"Fpootball","userId":"117","betDetailsDto":[{"betType":"UNDER","eventDate":1672254000}],"shareText":"Place This NCAAF Bet:\nOVER 64.5 UCF Knights at Duke Blue Devils +140\n$7.14 wins $10.00\n\n<https://betopenly.com/bet/CC98CF72-7FEC-4B39-9932-9A7F2C6FF042>\n-------------------------------------","outcome":"WON","amount":10,"amountToWin":7.142857142857143,"betDate":1672253165,"settlementDate":1672266239,"signature":"200a0179655372cfc4cabd32f250e1740d6210d7082e2526d90df7aee308acea"}

    await Scrimmage.reward.trackRewardable<Bet>({
      id: <string>data.id,
      userId: <string>context.auth?.uid,
      type: 'bet',
      betType: <BetType>data.betType,
      // decimal odds
      odds: <number>data.odds,
      description: <string>data.description,
      // convert everything in dollars
      wagerAmount: <number>data.wagerAmount,
      // convert everything in dollars
      netProfit: <number>data.netProfit,
      outcome: <BetOutcome>data.outcome, // Make sure you convert
      betDate: <number>data.betDate, // UNIX
      bets: data.bets.map((bet: SingleBet) => ({
        type: <SingleBetType>bet.type,
        odds: <number>bet.odds, // decimal odds
        teamBetOn: <string>bet?.teamBetOn,
        teamBetAgainst: <string>bet?.teamBetAgainst,
        league: <BetLeague>bet?.league,
        sport: <BetSport>bet?.sport,
      })),
    });
  });

export const getUserInfo =
  functions.https.onCall(async (data, context) => {
    init();
    functions.logger.info('getUserInfo');

    try {
      const profile = await Scrimmage.user.getOne(String(context.auth?.uid));
      return {
        isLinked: true,
        profile,
      };
    } catch (e) {
      return {
        isLinked: false,
        profile: null,
      };
    }
  });
