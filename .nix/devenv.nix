{pkgs,...}:


{
  services.postgres.enable = true;
  services.postgres.package=pkgs.postgresql_17;
  services.postgres.listen_addresses="127.0.0.1";
  services.postgres.port=5432;


  services.postgres.initialDatabases= [
     {
     name = "events";
     user = "kt";
     pass = "ktkt";

     }
  ];

}
