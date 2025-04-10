<template>
	<div class="flex flex-col w-full h-full">
		<div class="font-[OstrichSansHeavy] text-slate-100 text-center text-[3em] pt-[0.15em] uppercase leading-[0.84em] pb-1 select-none">{{_date_str(today)}} Forecast</div>
		<AgGridVue
		  :style="{margin:'0 auto',width:'1000px',maxWidth:'calc(100vw - 2em)',height:'100%'}"
		  ref="Grid"
			:rowData="rows"
			:columnDefs="columns"
			:tooltipShowDelay="delay"
		/>
  </div>
</template>
<script lang="ts">
	import { AgGridVue } from "ag-grid-vue3";
	import type { ColDef } from 'ag-grid-community';
	import _ from 'lodash';

	function calcScore(type: string, input: number): number {
		switch (true) {
		case type.indexOf('_temp') > 0:

			return Math.min(Math.abs(input - 72) / 48, 1) / 2;
			break;
		case type === 'data.wind_spd':

			return Math.min(input / 33, 1);
			break;
		case type === 'data.rh':

			if (input >= 30 && input <= 50) {

		    return 0;
		  } else if (input < 30) {

		    return (30 - input) / 30;
		  } else {

		    return (input - 50) / 50;
		  }

			break;
		case type === 'data.pop':

			return input / 100;
			break;
		case type === 'data.weather.code':

			if (input === 751 || input === 731 || input === 711 || input === 622 || input === 612 || input === 602 || input === 610 || input === 522 || input === 511 || input === 502 || input === 233 || input === 232 || input === 231 || input === 202 || input === 201) return 1;

	    else return 0;
			break;
		default:
			return 0;
		}
	}

	function range(k: string, n: number) {
		ranges[k][0] = n < ranges[k][0] ? n : ranges[k][0];
		ranges[k][1] = n > ranges[k][1] ? n : ranges[k][1];
	}

	function spotColor(spot: number, low: number, high: number): string {
	  const mid = (low + high) / 2;
	  let r = 0, g = 0, b = 0, a = 0;
	  if (spot <= mid) {
	    r = 93;
	    g = 162;
	    b = 113;

	    if (spot <= low) {
	      a = 0.75;
	    } else {
	      const opacity = 0.75 * (1 - (spot - low) / (mid - low));
	      a = Math.max(0, Math.min(0.75, opacity));
	    }

	  } else {
	    r = 200;
	    g = 70;
	    b = 48;

	    if (spot >= high) {
	      a = 0.75;
	    } else {
	      const opacity = 0.75 * (1 - (high - spot) / (high - mid));
	      a = Math.max(0, Math.min(0.75, opacity));
	    }

	  }

	  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
	}

	function humanDate(date: string): string {

	 return new Date(date).toLocaleDateString('en-us', {year:'numeric', month:'short', day:'numeric'})
	};

	function windDir(direction: string): string {
	  const directionToDegrees: { [key: string]: number } = {
	    N: 0,
	    NNE: 22.5,
	    NE: 45,
	    ENE: 67.5,
	    E: 90,
	    ESE: 112.5,
	    SE: 135,
	    SSE: 157.5,
	    S: 180,
	    SSW: 202.5,
	    SW: 225,
	    WSW: 247.5,
	    W: 270,
	    WNW: 292.5,
	    NW: 315,
	    NNW: 337.5
	  };

	  const degrees = directionToDegrees[direction.toUpperCase()] ?? 0;

	  return `display:inline-block; transform: rotate(${degrees}deg);`;
	}

	const colDef: ColDef[] = [
		{
			width: 136,
			pinned: 'left',
			field: 'location',
	    headerName: 'Location',
	    suppressHeaderMenuButton: true,
	    headerTooltip: 'Today\'s Weather Forecast',
	    cellRenderer: (p: any) => {

	      return `${p.value.name}, ${p.value.state}`;
	    },
	    valueGetter: (p: any) => {
	    	const { name, state } = p.data.location;

	      return { name, state };
	    }
	  },
	  {
	  	flex: 1,
	  	minWidth: 75,
	  	field: 'data.app_max_temp',
	    headerName: 'F° Max',
	    suppressHeaderMenuButton: true,
	    headerTooltip: 'High Apparent Temperature. 72° is perfect, score [0-0.5]',
	    cellRenderer: (p: any) => {
	    	const score = p.value.toFixed(3);

	      return `${p.node.data.data.app_min_temp}°${score != 0 ? ` <sup>[${score}]</sup>`: ``}`;
	    },
	    valueGetter: (p: any) => {
	    	const { app_max_temp_score } = p.data.data;

	      return app_max_temp_score;
	    },
	    cellStyle: (p: any) => {

	    	return {
	    		backgroundColor: spotColor(p.value, ranges[p.colDef.field][0], ranges[p.colDef.field][1])
	    	}
	    }
	  },
	  {
	  	flex: 1,
	  	minWidth: 75,
	  	field: 'data.app_min_temp',
	    headerName: 'F° Min',
	    suppressHeaderMenuButton: true,
	    headerTooltip: 'Low Apparent Temperature. 72° is perfect, score [0-0.5]',
	    cellRenderer: (p: any) => {
	    	const score = p.value.toFixed(3);

	      return `${p.node.data.data.app_min_temp}°${score != 0 ? ` <sup>[${score}]</sup>`: ``}`;
	    },
	    valueGetter: (p: any) => {
	    	const { app_min_temp_score } = p.data.data;

	      return app_min_temp_score;
	    },
	    cellStyle: (p: any) => {

	    	return {
	    		backgroundColor: spotColor(p.value, ranges[p.colDef.field][0], ranges[p.colDef.field][1])
	    	}
	    }
	  },
	  {
	  	flex: 1,
	  	minWidth: 70,
	  	field: 'data.wind_spd',
	    headerName: 'Wind',
	    suppressHeaderMenuButton: true,
	    headerTooltip: 'Wind Speed. 33mph is intolerable, score [0-1]',
	    cellRenderer: (p: any) => {
	    	const score = p.value.toFixed(3);

	    	const html = `${p.node.data.data.wind_spd}<span style="font-size:0.69em;margin-left:0.1em;">mph</span> <span style="${windDir(p.node.data.data.wind_cdir)}">➝</span> ${score != 0 ? `<sup>[${score}]</sup>` : ``}`;

	      return html;
	    },
	    valueGetter: (p: any) => {
	    	const { wind_spd_score } = p.data.data;

	      return wind_spd_score;
	    },
	    cellStyle: (p: any) => {

	    	return {
	    		backgroundColor: spotColor(p.value, ranges[p.colDef.field][0], ranges[p.colDef.field][1])
	    	}
	    }
	  },
	  {
	  	flex: 1,
	  	minWidth: 70,
	  	field: 'data.rh',
	    headerName: 'Humidity',
	    headerTooltip: 'Relative humidity, score [0-1]',
	    suppressHeaderMenuButton: true,
	    cellRenderer: (p: any) => {
	    	const score = p.value.toFixed(3);

	      return `${p.node.data.data.rh}%${score != 0 ? ` <sup>[${score}]</sup>`: ``}`;
	    },
	    valueGetter: (p: any) => {
	    	const { rh_score } = p.data.data;

	      return rh_score;
	    },
	    cellStyle: (p: any) => {

	    	return {
	    		backgroundColor: spotColor(p.value, ranges[p.colDef.field][0], ranges[p.colDef.field][1])
	    	}
	    }
	  },
	  {
	  	flex: 1,
	  	minWidth: 70,
	  	field: 'data.pop',
	    headerName: 'Precipitation',
	    suppressHeaderMenuButton: true,
	    headerTooltip: 'Probability of precipitation, score [0-1]',
	    cellRenderer: (p: any) => {
	    	const score = p.value.toFixed(3);


	      return `${p.node.data.data.pop}%${score != 0 ? ` <sup>[${score}]</sup>`: ``}`;
	    },
	    valueGetter: (p: any) => {
	    	const { pop_score } = p.data.data;

	      return pop_score;
	    },
	    cellStyle: (p: any) => {

	    	return {
	    		backgroundColor: spotColor(p.value, ranges[p.colDef.field][0], ranges[p.colDef.field][1])
	    	}
	    }
	  },
	  {
	  	width: 70,
	  	field: 'data.weather.code',
	    headerName: 'Desc.',
	    headerTooltip: 'Weather Description, eg. "Thunderstorm with heavy rain" scores 1, "Clear sky" scores 0',
	    suppressHeaderMenuButton: true,
	    cellRenderer: (p: any) => {
	    	const score = p.value.toFixed(0);

	      return `<sup>[${score}]</sup>`;
	    },
	    valueGetter: (p: any) => {
	    	const { code_score } = p.data.data.weather;

	      return code_score;
	    },
	    cellStyle: (p: any) => {

	    	return {
	    		backgroundColor: spotColor(p.value, ranges[p.colDef.field][0], ranges[p.colDef.field][1])
	    	}
	    }
	  },
	  {
	  	width: 95,
	  	field: 'score',
	    headerName: 'Cuml.',
	    headerTooltip: 'Cumulative Score',
	    suppressHeaderMenuButton: true,
	    pinned: 'right',
	    sort: 'desc',
	    cellRenderer: (p: any) => {
	    	const score = p.value.toFixed(3);

	      return `<strong>${score}</strong>`;
	    },
	    valueGetter: (p: any) => {
	    	const { score } = p.data;

	      return score;
	    },
	    cellStyle: (p: any) => {

	    	return {
	    		backgroundColor: spotColor(p.value, ranges[p.colDef.field][0], ranges[p.colDef.field][1])
	    	}
	    }
	  },
	];

	const ranges: { [key: string]: [number, number] } = {};
	for (const col of colDef) {
		const { field } = col;
  	if (field && field !== 'location') {
			ranges[field] = [Infinity, 0];
		}
	}

	export default {
		name: 'Grid',
		props: [ 'today', 'content' ],
		components: { AgGridVue },
		data() {
			return {
				rows: [],
  		  columns: colDef,
  		  delay: 100
			}
		},
		mounted() {
			for (const node of this.content) {
				for (const col in ranges) {

					if (col !== 'score') {
						const score = calcScore(col, _.get(node, col));
						_.set(node, `${col}_score`, score);
						range(col, score);
					} else {
						range(col, node.score);
					}

				}
			}

			this.rows = this.content;
		},
		methods: {
			_date_str(date: string) {
				const [year, month, day] = date.split('-').map(Number);
			  const utcDate = new Date(Date.UTC(year, month - 1, day));
			  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			  const months = [
			    'January', 'February', 'March', 'April', 'May', 'June',
			    'July', 'August', 'September', 'October', 'November', 'December'
			  ];
			  const weekday = daysOfWeek[utcDate.getUTCDay()];
			  const monthName = months[utcDate.getUTCMonth()];
			  const dayOfMonth = utcDate.getUTCDate();
			  const getOrdinal = (n: number) => {
			    if (n > 3 && n < 21) return 'th';
			    switch (n % 10) {
			      case 1: return 'st';
			      case 2: return 'nd';
			      case 3: return 'rd';
			      default: return 'th';
			    }
			  };

			  const ordinal = getOrdinal(dayOfMonth);

			  return `${weekday}, ${monthName} ${dayOfMonth}${ordinal}`;
			}
		}
	}
</script>