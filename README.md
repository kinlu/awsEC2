# awsEC2

This script allows you to create one EC2 instance in AWS.

### Install dependencies
```
npm install
```

Modify the ./config/config.json.  Put your AWS credentials in the config.
```
{
  "aws_access_key_id": "",
  "aws_secret_access_key": "",
  "region": "ap-southeast-2"
}
```

The script will pick "ami-0e2b2114bf2fac7d8" as a default AMI and "t1.micro" as a default instance type when you run:
```
npm run start
```

In your CI server, you may want to designate the AMI and instance type through command argument, e.g.
```
ImageId="ami-0e2b2114bf2fac7d8" InstanceType="t1.micro" npm run start
```
