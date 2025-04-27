describe('Rides API', () => {
  let createdRideId: string; 

  it('should create a new ride', () => {
    cy.request('POST', '/rides', {
      distance: 25,
      duration: 60,
      type: 'Cycling',
      notes: 'Morning ride',
    }).then((response) => {
      expect(response.status).to.eq(201);

      createdRideId = response.body.ride.id; 
      expect(createdRideId, 'createdRideId from POST should exist').to.exist;
      cy.log(`Created ride ID: ${createdRideId}`);
    });
  });

  it('should fetch all rides', () => {
    cy.request('GET', '/rides').then((response) => {
      expect(response.status).to.eq(200);

      const rides = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
      expect(rides).to.be.an('array');
      expect(rides.length).to.be.greaterThan(0);

      const ride = rides.find(r => r.id === createdRideId);
      expect(ride, 'Created ride should be in fetched rides').to.exist;
      expect(ride).to.have.property('id');
      expect(ride).to.have.property('distance');
      expect(ride).to.have.property('duration');
      expect(ride).to.have.property('type');
      expect(ride).to.have.property('notes');
    });
  });

  it('should delete the created ride', () => {
    cy.log(`Attempting to delete ride with ID: ${createdRideId}`);

    cy.request({
      method: 'DELETE',
      url: `/rides/${createdRideId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Delete response status: ${response.status}`);
      cy.log(`Delete response body: ${JSON.stringify(response.body)}`);

      expect(response.status).to.eq(200);

      const responseBody = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
      expect(responseBody.message).to.include('deleted');
    });
  });
});
