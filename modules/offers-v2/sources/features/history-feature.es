import History from '../../platform/history/history';
import Feature from './feature';
import moment from '../../platform/lib/moment';
import DefaultMap from '../../core/helpers/default-map';
import UrlData from '../common/url_data';
import logger from '../common/offers_v2_logger';

/**
 * {
 *   pid: string, // some unique ID, unused
 *   patters: string[], // set of URLs
 *   index: SimplePatternIndex, // compiled set of URLs
 *   start_ms: number,
 *   end_ms: number,
 * }
 * @class HistoryQueryRequest
 */

/**
 * {
 *   pid: string, // some unique ID, taken from `HistoryQueryRequest`
 *   info: {}, // unused
 *   match_data: DayCounter
 * }
 * @class HistoryQueryResponse
 */

/**
 * Query history
 *
 * @class HistoryFeature
 */
export default class HistoryFeature extends Feature {
  constructor(history = History) {
    super('history');
    this.history = history;
  }

  init() {
    return true;
  }

  unload() {
    return true;
  }

  isAvailable() {
    return true;
  }

  /**
   * @param {string} pid: was intended to cache requests
   * @param {string} categoryId: consider matches only of this category
   * @param {MultiPatternIndex} index: pattern matcher
   * @return {Promise<QueryHistoryResponse>}
   */
  async performQueryOnHistory({ pid, categoryId, index, start_ms: startMs, end_ms: endMs }) {
    const after = startMs - 1;
    const before = endMs + 1;
    const days = new DefaultMap(() => 0);

    if (!index) {
      logger.error('performQueryOnHistory: no index');
      return {};
    }

    // Empty index (no patterns) is possible for segmentation categories
    const visits = index.isEmpty()
      ? []
      : await this.history.queryVisitsForTimespan({
        frameStartsAt: after,
        frameEndsAt: before,
      });
    for (const { ts, url } of visits) {
      const urlData = new UrlData(url);
      const match = index.match(urlData.getPatternRequest());
      if (match.has(categoryId)) {
        const day = moment(ts).format('YYYYMMDD');
        days.update(day, v => v + 1);
      }
    }

    // eslint-disable-next-line camelcase
    const per_day = {};
    const total = {
      num_days: 0,
      m: 0,
      last_checked_url_ts: before,
    };

    days.forEach((count, day) => {
      total.num_days += 1;
      total.m += count;

      per_day[day] = {
        m: count,
      };
    });

    return {
      pid,
      d: {
        match_data: {
          total,
          per_day,
        },
      },
    };
  }
}
