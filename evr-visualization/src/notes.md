
## Charge Point

Charge Point - we are not communicating, there just isn't the the capability.

Gillig instead of New Flyer. Gillig uses Veracity software instead of New Flyer.

What we're not clear on is how we're going to pull data from Veracity. Veracity 'has' smart charging software, but we don't know what it is. We will need to take a look at Veracity to see what we can get from them, how to use their data.

A little concerned that Charge Point owns Veracity now.

Latency issues with Charge Point's network. No consistency with their network. Charge Point has fallen to the bottom of Rocky Mountain power's. Overall a lack of collaboration.


## ABB

We need ABB to turn on meter values for the UTA chargers. Make a list of what we need from ABB for this, so they can fill out sheets/etc. Record the documentation on how we should do it, for future. It seems to be that there can only be 2 IPs that a charger can communicate. Does this start to become a conflict issue? If only 2 can communicate, and ABB already takes one, we need to figure out if this is a true limit.

We should make note of what things we are having to turn on.


## Names for Chargers

HVC150 - Overhead (IMH - Over 2)

NAMHVC150 - 003 (IMH - Depot), 005 (IMH - Over 1)


## Categories

We should differentiate between the 3 different types of hardware are, (overhead, depot, fast charge). This is important since not all will necessarily be as updated and useful as each other. If there is anything specific to those chargers, we can just immediately tell ABB to turn on the exact things we need.


## Total Overheads

Salt Lake will have 10-12 overheads, Ogden will have 2-3.


## Future

We should also start looking into OCPP 2.1 features and set up our system to be able to handle OCPP 2.1.

Overhead tests in the next week or two preferably. Mainly to see whether or not the charger fully disconnects with the start and stop transactions.


## Dashboard

* EVR Load for facility. Can we get a breakout of all the solar inverters, instead of a single dump? This will help see when there are problems and such
* Each inverter should be able to be seen
* Total facility load should be shown
* All capabilities should be shown separately, with some history
* Dynapower unit has the data we need. We can start by working with that one
* Battery packs, solar inverters, anything that can communicate should be shown

* Battery packs, solar inverters, chargers are goal for showing now.

* Instead of charger being on or off, be able to see power usage, how much is being drawn and such. We can do this for sure for ABB, but we will have to see for Charge Point.
* Show what a charger is curtailed at as well.


## Action Items

* Communicate with Veracity for Gillig data
* Make a list of what we have on the USU charger that we would like on the UTA chargers.
* Communicate on IPs
* Paint the data in a visual way, so we can see what has been communicating (by charger, transaction history, etc)
* Look into getting the CIE pack communicating with our server
* If we could get the Charge Point communicating that would be sweet
* Check if the ABB chargers are dynamically connected (sharing the sides when they can) Are our units capable of dynamic charging from a software perspective.
* We should set ABB chargers to 50 kW max just all the time.