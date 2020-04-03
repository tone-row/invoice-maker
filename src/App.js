import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Helmet } from "react-helmet";
import {
  Details,
  Table,
  Form,
  LargeText,
  MediumText,
  SmallTitle,
  Invoice,
  Grid,
  ExtraSmallText,
  Half,
  Three,
  One,
  Two,
  TotalWrapper,
  SpaceChildren
} from "./styled";

function ServiceFormBlock({
  updateService,
  name,
  hours,
  rate,
  index,
  canDelete = false,
  deleteService
}) {
  return (
    <>
      <label htmlFor={`name ${index}`}>
        Service{" "}
        <input
          type="text"
          value={name}
          onChange={({ target: { value } }) =>
            updateService(index, { name: value })
          }
        />
      </label>
      <label htmlFor={`hours ${index}`}>
        Hours{" "}
        <input
          type="number"
          value={hours}
          onChange={({ target: { value } }) =>
            updateService(index, { hours: value })
          }
        />
      </label>
      <label htmlFor={`rate ${index}`}>
        Rate (USD){" "}
        <input
          type="number"
          x
          value={rate}
          onChange={({ target: { value } }) =>
            updateService(index, { rate: value })
          }
        />
      </label>
      {canDelete && (
        <button
          type={"button"}
          onClick={() => {
            if (window.confirm("Are you sure?")) {
              deleteService(index);
            }
          }}
        >
          Delete
        </button>
      )}
    </>
  );
}

function Actor({
  name,
  address,
  phone,
  email,
  titleWrapper: TitleWrapper = LargeText
}) {
  return (
    <div>
      {name && <TitleWrapper>{name}</TitleWrapper>}
      <Details>
        <address>{address}</address>
        <span className="phone-number">{phone}</span>
        <a href={`mailto:${email}`}>{email}</a>
      </Details>
    </div>
  );
}

function TransferOptions() {
  return (
    <ExtraSmallText>
      <Grid>
        <Two>
          Payment by transfer:
          <div>
            Account #<br />
            {process.env.REACT_APP_ACC_NUMBER}
            <br />
            Routing #<br />
            {process.env.REACT_APP_ROUTING_NUMBER}
          </div>
        </Two>

        <Two>
          Or send a check to:
          <address>
            <div>TONE ROW LLC</div>
            <div>2705 Van Dyke Avenue</div>
            <div>Raleigh, NC 27607</div>
          </address>
        </Two>
        <Three>
          This invoice must be fully paid no later than thirty (30) days from
          the date of invoice.
        </Three>
        <One>
          <img src={"/smiley.svg"} alt="Smiley" />
        </One>
      </Grid>
    </ExtraSmallText>
  );
}

function App() {
  const [services, setServices] = useState([]);
  const newServiceName = useRef();
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [convert, setConvert] = useState(false);
  const [conversionRate, setConversionRate] = useState(1);
  const [invNumber, setInvNumber] = useState(1);

  useEffect(() => {
    async function fetchRates() {
      const { data } = await axios.get(
        `https://api.exchangeratesapi.io/latest?base=USD`
      );
      setConversionRate(data.rates.CAD);
    }
    fetchRates();
  }, []);

  const updateService = useCallback(
    (index, value) => {
      const newServices = services.slice(0);
      newServices[index] = { ...newServices[index], ...value };
      setServices(newServices);
    },
    [services, setServices]
  );

  const deleteService = useCallback(
    index => {
      const newServices = services.slice(0);
      newServices.splice(index, 1);
      setServices(newServices);
    },
    [services, setServices]
  );

  const addService = useCallback(() => {
    if (newServiceName.current && newServiceName.current.value) {
      setServices([
        ...services,
        { name: newServiceName.current.value, hours: 20, rate: 60 }
      ]);
      newServiceName.current.value = "";
    }
  }, [services, setServices]);

  const total = services
    .map(({ hours, rate }) => hours * rate)
    .reduce((a, n) => a + n, 0);

  const baseFormatter = useCallback(amt => {
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
      style: "currency"
    }).format(amt);
  }, []);

  const conversionFormatter = useCallback(amt => {
    return new Intl.NumberFormat("en-CA", {
      currency: "CAD",
      style: "currency"
    }).format(amt);
  }, []);

  return (
    <div className="App">
      <Helmet>
        <title>{`Invoice ${invNumber
          .toString()
          .padStart(5, "0")} — ${clientName}`}</title>
      </Helmet>
      <Form>
        <h1>Invoice Maker</h1>
        <h2>Invoice</h2>
        <label htmlFor={`inv number`}>
          Invoice Number{" "}
          <input
            type="number"
            value={invNumber}
            onChange={({ target: { value } }) => setInvNumber(value)}
          />
        </label>
        <h2>Client</h2>
        {[
          [clientName, setClientName, "Name"],
          [clientAddress, setClientAddress, "Address"],
          [clientPhone, setClientPhone, "Phone"],
          [clientEmail, setClientEmail, "Email"]
        ].map(([value, setValue, niceName]) => (
          <input
            type="text"
            value={value}
            onChange={({ target: { value: newValue } }) => setValue(newValue)}
            placeholder={niceName}
          />
        ))}

        <h2>Services</h2>
        <ul className="services">
          {services.map((service, i) => (
            <li>
              <ServiceFormBlock
                updateService={updateService}
                index={i}
                canDelete={true}
                deleteService={deleteService}
                {...service}
              />
            </li>
          ))}
        </ul>
        <input
          ref={newServiceName}
          type="text"
          name="New Service"
          placeholder="Service Name"
        />
        <button type="button" onClick={addService}>
          Add Service
        </button>

        <h2>Conversion</h2>
        <label>
          Convert to CAD{" "}
          <input
            type="checkbox"
            checked={convert}
            onChange={({ target: { checked } }) => setConvert(checked)}
          />{" "}
        </label>
      </Form>
      <Invoice>
        <Grid>
          <Half>
            <LargeText>TONE ROW</LargeText>
          </Half>
          <Half>
            <Actor
              name={""}
              address={"2705 Van Dyke Avenue, Raleigh NC 27607"}
              phone={"+1 929-259-4302"}
              email={"rob.gordon@tone-row.com"}
            />
          </Half>
        </Grid>
        <Grid>
          <Half>
            <SpaceChildren>
              <MediumText>{clientName}</MediumText>
              <Actor
                name={""}
                address={clientAddress}
                phone={clientPhone}
                email={clientEmail}
                titleWrapper={MediumText}
              />
            </SpaceChildren>
          </Half>
          <Two>
            <SpaceChildren>
              <SmallTitle>Date</SmallTitle>
              <div>{moment().format("MM/DD/YYYY")}</div>
            </SpaceChildren>
          </Two>
          <Two>
            <SpaceChildren>
              <SmallTitle>Invoice</SmallTitle>
              <div>{invNumber.toString().padStart(5, "0")}</div>
            </SpaceChildren>
          </Two>
        </Grid>
        <Table>
          <SpaceChildren>
            <Grid>
              <Three>
                <SmallTitle>Service</SmallTitle>
              </Three>
              <One>
                <SmallTitle>Hours</SmallTitle>
              </One>
              <Two>
                <SmallTitle>Rate</SmallTitle>
              </Two>
              <Two>
                <SmallTitle>Subtotal</SmallTitle>
              </Two>
            </Grid>
            <div className="last-child">
              {services.map(({ name, hours, rate }) => (
                <Grid>
                  <Three>{name}</Three>
                  <One>{hours}</One>
                  <Two>{baseFormatter(rate)} / Hour</Two>
                  <Two>{baseFormatter(hours * rate)} (USD)</Two>
                </Grid>
              ))}
            </div>
          </SpaceChildren>
        </Table>
        <Grid>
          <TotalWrapper>
            <SpaceChildren>
              <SmallTitle>Total</SmallTitle>
              <MediumText style={{ whiteSpace: "nowrap" }}>
                {baseFormatter(total)}
              </MediumText>
              {convert && (
                <div>
                  <SmallTitle>
                    {conversionFormatter(conversionRate * total)} (CAD)
                  </SmallTitle>
                  <ExtraSmallText>
                    Conversion rate ({conversionRate}), taken from the European
                    Central Bank on {moment().format("MMMM Do YYYY, h:mm:ss a")}
                  </ExtraSmallText>
                </div>
              )}
            </SpaceChildren>
          </TotalWrapper>
        </Grid>
        <TransferOptions />
      </Invoice>
    </div>
  );
}

export default App;
