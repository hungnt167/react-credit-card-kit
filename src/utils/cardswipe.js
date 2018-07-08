export class Cardswipe {
  parseSwiperData = value => {
    if (value.charAt(0) !== '%') {
      return -1;
    }
    let p = this.swipeParserObj(value);
    let result = {};
    if (p.hasTrack1) {
      if (p.account_name != null) result['name'] = p.account_name;
      else result['name'] = p.surname + ' ' + p.firstname;
      result['number'] = p.account;
      result['exp_month'] = p.exp_month;
      result['exp_year'] = p.exp_year;

      result['name'] = result['name']
        ? result['name'].replace(/\//, ' ')
        : result['name'];
    }
    return result;
  };

  swipeParserObj = strParse => {
    this.input_trackdata_str = strParse;
    this.account_name = null;
    this.surname = null;
    this.firstname = null;
    this.account = null;
    this.exp_month = null;
    this.exp_year = null;
    this.track1 = null;
    this.track2 = null;
    this.hasTrack1 = false;
    this.hasTrack2 = false;

    let sTrackData = this.input_trackdata_str;
    if (strParse != '') {
      let nHasTrack1 = strParse.indexOf('^');
      let nHasTrack2 = strParse.indexOf('=');

      let bHasTrack1 = (this.hasTrack1 = false);
      let bHasTrack2 = (this.hasTrack2 = false);
      if (nHasTrack1 > 0) {
        this.hasTrack1 = bHasTrack1 = true;
      }
      if (nHasTrack2 > 0) {
        this.hasTrack2 = bHasTrack2 = true;
      }

      let bTrack1_2 = false;
      let bTrack1 = false;
      let bTrack2 = false;

      if (bHasTrack1 && bHasTrack2) {
        bTrack1_2 = true;
      }
      if (bHasTrack1 && !bHasTrack2) {
        bTrack1 = true;
      }
      if (!bHasTrack1 && bHasTrack2) {
        bTrack2 = true;
      }
      let bShowAlert = false;

      if (bTrack1_2) {
        let strCutUpSwipe = '' + strParse + ' ';
        let arrayStrSwipe = new Array(4);
        arrayStrSwipe = strCutUpSwipe.split('^');
        let sAccountNumber, sName, sShipToName, sMonth, sYear;
        if (arrayStrSwipe.length > 2) {
          this.account = this.stripAlpha(
            arrayStrSwipe[0].substring(1, arrayStrSwipe[0].length)
          );
          this.account_name = arrayStrSwipe[1];
          this.exp_month = arrayStrSwipe[2].substring(2, 4);
          this.exp_year = '20' + arrayStrSwipe[2].substring(0, 2);
          if (sTrackData.substring(0, 1) == '%') {
            sTrackData = sTrackData.substring(1, sTrackData.length);
          }
          let track2sentinel = sTrackData.indexOf(';');
          if (track2sentinel != -1) {
            this.track1 = sTrackData.substring(0, track2sentinel);
            this.track2 = sTrackData.substring(track2sentinel);
          }
          let nameDelim = this.account_name.indexOf('/');
          if (nameDelim != -1) {
            this.surname = this.account_name.substring(0, nameDelim);
            this.firstname = this.account_name.substring(nameDelim + 1);
          }
        } else {
          bShowAlert = true;
        }
      }

      let strCutUpSwipe;
      let arrayStrSwipe;
      let sYear;
      let sMonth;
      let sAccountNumber;

      if (bTrack1) {
        strCutUpSwipe = '' + strParse + ' ';
        arrayStrSwipe = new Array(4);
        arrayStrSwipe = strCutUpSwipe.split('^');

        let sAccountNumber, sName, sShipToName, sMonth, sYear;

        if (arrayStrSwipe.length > 2) {
          this.account = sAccountNumber = this.stripAlpha(
            arrayStrSwipe[0].substring(1, arrayStrSwipe[0].length)
          );
          this.account_name = sName = arrayStrSwipe[1];
          this.exp_month = sMonth = arrayStrSwipe[2].substring(2, 4);
          this.exp_year = sYear = '20' + arrayStrSwipe[2].substring(0, 2);
          if (sTrackData.substring(0, 1) == '%') {
            this.track1 = sTrackData = sTrackData.substring(
              1,
              sTrackData.length
            );
          }
          this.track2 =
            ';' +
            sAccountNumber +
            '=' +
            sYear.substring(2, 4) +
            sMonth +
            '111111111111?';
          sTrackData = sTrackData + this.track2;
          let nameDelim = this.account_name.indexOf('/');
          if (nameDelim != -1) {
            this.surname = this.account_name.substring(0, nameDelim);
            this.firstname = this.account_name.substring(nameDelim + 1);
          }
        } else {
          bShowAlert = true;
        }
      }
      if (bTrack2) {
        let nSeperator = strParse.indexOf('=');
        let sCardNumber = strParse.substring(1, nSeperator);
        sYear = strParse.substr(nSeperator + 1, 2);
        sMonth = strParse.substr(nSeperator + 3, 2);
        this.account = sAccountNumber = this.stripAlpha(sCardNumber);
        this.exp_month = sMonth = sMonth;
        this.exp_year = sYear = '20' + sYear;
        if (sTrackData.substring(0, 1) == '%') {
          sTrackData = sTrackData.substring(1, sTrackData.length);
        }
      }
      if ((!bTrack1_2 && !bTrack1 && !bTrack2) || bShowAlert) {
        //alert('Difficulty Reading Card Information.\n\nPlease Swipe Card Again.');
      }
    }

    return this;
  };

  stripAlpha = sInput => {
    if (sInput == null) return '';
    return sInput.replace(/[^0-9]/g, '');
  };

  trimNumber = s => {
    while (s.substr(0, 1) == '0' && s.length > 1) {
      s = s.substr(1, 9999);
    }
    return s;
  };
}
