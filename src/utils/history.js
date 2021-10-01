import { Map, fromJS } from 'immutable';
import diff from 'immutablediff';
import patch from 'immutablepatch';

export const historyPush = (historyStructure, item) => {
  if (historyStructure.last) {
    if (historyStructure.last.hashCode() !== item.hashCode()) {
      let toPush = new Map({
        time: Date.now(),
        diff: diff(historyStructure.last, item)
      });

      historyStructure = historyStructure
        .set('last', item)
        .set('list', historyStructure.list.push(toPush))
        .set('temp', fromJS([]));
    }
  }
  else {
    historyStructure = historyStructure.set('last', item);
  }
  return historyStructure;
};

export const historyPop = (historyStructure) => {
  if (historyStructure.last) {
    if (historyStructure.list.size) {
      let last = historyStructure.first;
      console.log(historyStructure.list);
      for (let x = 0; x < historyStructure.list.size - 1; x++) {
        last = patch(last, historyStructure.list.get(x).get('diff'));
      }

      let pop = historyStructure.list.get(historyStructure.list.size - 1);
      historyStructure = historyStructure
        .set('last', last)
        .set('list', historyStructure.list.pop())
        .set('temp', historyStructure.temp.push(pop));
    }
  }
  return historyStructure;
};

export const historyRedoPush = (historyStructure) => {
  if (historyStructure.temp.size) {
    let last = historyStructure.last;
    for (let x = 0; x < historyStructure.temp.size - 1; x++) {
      last = patch(last, historyStructure.temp.get(x).get('diff'));
    }
    let pop = historyStructure.temp.get(historyStructure.temp.size - 1);
    historyStructure = historyStructure
      .set('last', last)
      .set('list', historyStructure.list.push(pop))
      .set('temp', historyStructure.temp.pop());
  }
  // else {
  //   historyStructure = historyStructure.set('last', item);
  // }
  return historyStructure;
};
