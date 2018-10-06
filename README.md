# awsEC2

This script allows you to create one EC2 instance in AWS.

### Install dependencies
```
npm install
```

### Config your credentials
Modify the ./config/config.json.  Put your AWS credentials in the config.  Or refer to [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html#getting-started-nodejs-credentials)
```
{
  "aws_access_key_id": "",
  "aws_secret_access_key": "",
  "region": "ap-southeast-2"
}
```
### Test the EC2 creation
```
npm test
```

### Run the script
The script will pick "ami-0e2b2114bf2fac7d8" as a default AMI and "t1.micro" as a default instance type when you run:
```
npm run start
```

In your CI server, you may want to designate the AMI and instance type through command arguments, e.g.
```
ImageId="ami-0e2b2114bf2fac7d8" InstanceType="t1.micro" npm run start
```
