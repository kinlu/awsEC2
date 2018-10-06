const should = require('should');

const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');

const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

const instanceParamsDryRun = {
  ImageId: process.env.ImageId || 'ami-0e2b2114bf2fac7d8',
  InstanceType: process.env.InstanceType || 't1.micro',
  MinCount: 1,
  MaxCount: 1,
  DryRun: true
};

const instanceParams = {
  ImageId: process.env.ImageId || 'ami-0e2b2114bf2fac7d8',
  InstanceType: process.env.InstanceType || 't1.micro',
  MinCount: 1,
  MaxCount: 1,
  DryRun: false
};

var instanceId;

describe('Test EC2', () => {
  
  it('should be authroised to launch EC2',  (done) =>  {
    ec2.runInstances(instanceParamsDryRun, err => {
      err.code.should.equal('DryRunOperation');
      done();
    })
  })
  
  it('should launch EC2 successfully',  (done) =>  {
    ec2.runInstances(instanceParams, (err, data) => {

      (err === null).should.be.true;
      data.should.not.be.null;
      console.log(data);
      instanceId = data.Instances[0].InstanceId;
      console.log("Created instance: ", instanceId);

        ec2.waitFor('instanceStatusOk', {InstanceIds: [instanceId]}, (err) => {
          (err === null).should.be.true;
          done();
        })
    })
  })

  after((done) => {
    ec2.terminateInstances({InstanceIds: [instanceId], DryRun: false}, (err) => {
      if(err) {
        console.error("Failed to terminate the instance!")
        console.error(err, err.stack);
        done();
      }
      else {
        console.log("Terminating the instance....");
        
        ec2.waitFor('instanceTerminated', {InstanceIds: [instanceId]}, (err) => {
        if(err) {
          console.error("Failed to terminate the instance!")
          console.error(err, err.stack);
          done();
        }
        else {
          console.log("The instance is terminated successfully");
          done();
        }
      })
      }
    });
  })
})