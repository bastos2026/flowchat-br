import React, { useContext, useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";

import CallIcon from "@material-ui/icons/Call";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TimerIcon from '@material-ui/icons/Timer';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PeopleIcon from '@material-ui/icons/People';

import { makeStyles } from "@material-ui/core/styles";
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";

import ButtonWithSpinner from "../../components/ButtonWithSpinner";

import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";

import useDashboard from "../../hooks/useDashboard";
import useContacts from "../../hooks/useContacts";
import { ChatsUser } from "./ChartsUser"

import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "var(--spacing-xl)",
    background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
    minHeight: "100vh",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "var(--spacing-lg)",
    marginBottom: "var(--spacing-xl)",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "var(--spacing-lg)",
    marginBottom: "var(--spacing-xl)",
  },
  chartCard: {
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "var(--border-radius-lg)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "var(--spacing-xl)",
    transition: "var(--transition-normal)",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "var(--shadow-hover)",
    },
  },
  chartTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "var(--text-primary)",
    marginBottom: "var(--spacing-lg)",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  filtersContainer: {
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "var(--border-radius-lg)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "var(--spacing-lg)",
    marginBottom: "var(--spacing-xl)",
    display: "flex",
    gap: "var(--spacing-lg)",
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterItem: {
    minWidth: 200,
  },
  filterLabel: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  select: {
    background: "var(--bg-glass)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "var(--border-radius)",
    "& .MuiSelect-select": {
      color: "var(--text-primary)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      background: "var(--bg-glass)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "var(--border-radius)",
      "& fieldset": {
        border: "none",
      },
      "& input": {
        color: "var(--text-primary)",
      },
    },
  },
  pageTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "var(--spacing-xl)",
    textAlign: "center",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [period, setPeriod] = useState(0);
  const [filterType, setFilterType] = useState(1);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
    async function handleChangePeriod(value) {
    setPeriod(value);
  }

  async function handleChangeFilterType(value) {
    setFilterType(value);
    if (value === 1) {
      setPeriod(0);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  }

  async function fetchData() {
    setLoading(true);

    let params = {};

    if (period > 0) {
      params = {
        days: period,
      };
    }

    if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
      params = {
        ...params,
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
      };
    }

    if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
      params = {
        ...params,
        date_to: moment(dateTo).format("YYYY-MM-DD"),
      };
    }

    if (Object.keys(params).length === 0) {
      toast.error(i18n.t("dashboard.toasts.selectFilterError"));
      setLoading(false);
      return;
    }

    const data = await find(params);

    setCounters(data.counters);
    if (isArray(data.attendants)) {
      setAttendants(data.attendants);
    } else {
      setAttendants([]);
    }

    setLoading(false);
  }

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

    const GetContacts = (all) => {
    let props = {};
    if (all) {
      props = {};
    }
    const { count } = useContacts(props);
    return count;
  };
  
    function renderFilters() {
    if (filterType === 1) {
      return (
        <>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label={i18n.t("dashboard.filters.initialDate")}
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label={i18n.t("dashboard.filters.finalDate")}
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item xs={12} sm={6} md={4}>
          <FormControl className={classes.selectContainer}>
            <InputLabel id="period-selector-label">
              {i18n.t("dashboard.periodSelect.title")}
            </InputLabel>
            <Select
              labelId="period-selector-label"
              id="period-selector"
              value={period}
              onChange={(e) => handleChangePeriod(e.target.value)}
            >
              <MenuItem value={0}>{i18n.t("dashboard.periodSelect.options.none")}</MenuItem>
              <MenuItem value={3}>{i18n.t("dashboard.periodSelect.options.last3")}</MenuItem>
              <MenuItem value={7}>{i18n.t("dashboard.periodSelect.options.last7")}</MenuItem>
              <MenuItem value={15}>{i18n.t("dashboard.periodSelect.options.last15")}</MenuItem>
              <MenuItem value={30}>{i18n.t("dashboard.periodSelect.options.last30")}</MenuItem>
              <MenuItem value={60}>{i18n.t("dashboard.periodSelect.options.last60")}</MenuItem>
              <MenuItem value={90}>{i18n.t("dashboard.periodSelect.options.last90")}</MenuItem>
            </Select>
            <FormHelperText>{i18n.t("dashboard.periodSelect.helper")}</FormHelperText>
          </FormControl>
        </Grid>
      );
    }
  }

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <Typography variant="h6" color="textSecondary">
          {i18n.t("dashboard.loading")}
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Typography className={classes.pageTitle}>
        {i18n.t("dashboard.title")}
      </Typography>

      {/* Filtros */}
      <div className={classes.filtersContainer}>
        <div className={classes.filterItem}>
          <Typography className={classes.filterLabel}>
            {i18n.t("dashboard.filters.filterType.title")}
          </Typography>
          <FormControl fullWidth>
            <Select
              value={filterType}
              onChange={(e) => handleChangeFilterType(e.target.value)}
              className={classes.select}
            >
              <MenuItem value={1}>{i18n.t("dashboard.filters.filterType.options.perDate")}</MenuItem>
              <MenuItem value={2}>{i18n.t("dashboard.filters.filterType.options.perPeriod")}</MenuItem>
            </Select>
          </FormControl>
        </div>

        {renderFilters()}

        <div className={classes.filterItem}>
          <ButtonWithSpinner
            loading={loading}
            onClick={() => fetchData()}
            variant="contained"
            color="primary"
            className="flowchat-btn flowchat-btn-primary"
          >
            {i18n.t("dashboard.buttons.filter")}
          </ButtonWithSpinner>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className={classes.statsGrid}>
        <CardCounter
          icon={<CallIcon />}
          title={i18n.t("dashboard.counters.inTalk")}
          value={counters.supportHappening || 0}
          loading={loading}
        />
        <CardCounter
          icon={<HourglassEmptyIcon />}
          title={i18n.t("dashboard.counters.waiting")}
          value={counters.supportPending || 0}
          loading={loading}
        />
        <CardCounter
          icon={<CheckCircleIcon />}
          title={i18n.t("dashboard.counters.finished")}
          value={counters.supportFinished || 0}
          loading={loading}
        />
        <CardCounter
          icon={<GroupAddIcon />}
          title={i18n.t("dashboard.counters.newContacts")}
          value={GetContacts(true) || 0}
          loading={loading}
        />
        <CardCounter
          icon={<AccessAlarmIcon />}
          title={i18n.t("dashboard.counters.averageTalkTime")}
          value={formatTime(counters.avgSupportTime) || "0min"}
          loading={loading}
        />
        <CardCounter
          icon={<TimerIcon />}
          title={i18n.t("dashboard.counters.averageWaitTime")}
          value={formatTime(counters.avgWaitTime) || "0min"}
          loading={loading}
        />
      </div>

      {/* Gráficos */}
      <div className={classes.chartGrid}>
        <div className={classes.chartCard}>
          <Typography className={classes.chartTitle}>
            <AssessmentIcon />
            {i18n.t("dashboard.charts.userTitle")}
          </Typography>
          <ChatsUser />
        </div>
        <div className={classes.chartCard}>
          <Typography className={classes.chartTitle}>
            <AssessmentIcon />
            {i18n.t("dashboard.charts.dateTitle")}
          </Typography>
          <ChartsDate />
        </div>
      </div>

      {/* Tabela de Atendentes */}
      {attendants.length > 0 && (
        <div className={classes.chartCard}>
          <Typography className={classes.chartTitle}>
            <PeopleIcon />
            {i18n.t("dashboard.attendantsStatus.title")}
          </Typography>
          <TableAttendantsStatus
            attendants={attendants}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
