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


ec2.runInstances(instanceParamsDryRun, (err) => {
  if(err.code === 'UnauthorizedOperation') {
    console.error("You are unauthorized to create the instance!")
    console.error(err, err.stack);
  }
  else {
    ec2.runInstances(instanceParams, (err, data) =>{
      if(err) {
        console.error("Failed to create the instance!")
        console.error(err, err.stack);
      }
      else {
        console.log(data);
        const instanceId = data.Instances[0].InstanceId;
        console.log("Created instance: ", instanceId);
        const tagParams = {Resources: [instanceId], Tags: [
            {
              Key: 'Name',
              Value: 'Test Instance'
            }
        ]};

        ec2.createTags(tagParams, (err) => {
          if(err) console.error(err, err.stack);
          else {

            console.log("Instance tagged");
            console.log("Waiting for instance ok status....")

            ec2.waitFor('instanceStatusOk', {InstanceIds: [instanceId]}, (err) => {
              if(err) {
                console.error("Failed to check the instance status!")
                console.error(err, err.stack);
              }
              else {
                console.log("The instance status is running in ok status now!  Proceed to terminate the instance!");

                ec2.terminateInstances({InstanceIds: [instanceId], DryRun: true}, (err) => {
                  if(err.code === 'UnauthorizedOperation') {
                    console.error("You are unauthorized to terminate the instance!")
                    console.error(err, err.stack);
                  }
                  else {
                    ec2.terminateInstances({InstanceIds: [instanceId], DryRun: false}, (err) => {
                      if(err) {
                        console.error("Failed to terminate the instance!")
                        console.error(err, err.stack);
                      }
                      else {
                        console.log("Terminating the instance....");
                        
                        ec2.waitFor('instanceTerminated', {InstanceIds: [instanceId]}, (err) => {
                        if(err) {
                          console.error("Failed to terminate the instance!")
                          console.error(err, err.stack);
                        }
                        else {
                          console.log("The instance is terminated successfully");
                        }
                      });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
})