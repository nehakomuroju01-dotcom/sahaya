package com.sahaya.services;

import com.sahaya.models.*;
import com.sahaya.repositories.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class DemoDataSeederService {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    private final ClaimRepository claimRepository;
    private final MissionRepository missionRepository;
    private final NeedRepository needRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeederService(
            UserRepository userRepository,
            DonationRepository donationRepository,
            ClaimRepository claimRepository,
            MissionRepository missionRepository,
            NeedRepository needRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.donationRepository = donationRepository;
        this.claimRepository = claimRepository;
        this.missionRepository = missionRepository;
        this.needRepository = needRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void seedIfEmpty() {
        if (!userRepository.existsByEmail("taj.banquets@gmail.com")) {
            resetAndSeed();
        }
    }

    @Transactional
    public void resetAndSeed() {
        System.out.println("Starting clean demo data reset and seed...");

        // 1. Delete in reverse dependency order using batch deletions
        missionRepository.deleteAllInBatch();
        claimRepository.deleteAllInBatch();
        needRepository.deleteAllInBatch();
        donationRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();

        // 2. Create Users
        String encodedDefaultPassword = passwordEncoder.encode("password123");
        String encodedAdminPassword = passwordEncoder.encode("admin12345678");

        // Admin
        User admin = new User("Sahaya Administrator", "admin@sahaya.com", encodedAdminPassword, Role.ADMIN);
        admin.setVerified(true);
        admin = userRepository.save(admin);

        // 2 Donors
        User donor1 = new User("Taj Krishna Banquets & Caterers", "taj.banquets@gmail.com", encodedDefaultPassword, Role.DONOR);
        donor1.setVerified(true);
        donor1 = userRepository.save(donor1);

        User donor2 = new User("Rohan Verma (Community Drive Lead)", "rohan.verma@gmail.com", encodedDefaultPassword, Role.DONOR);
        donor2.setVerified(true);
        donor2 = userRepository.save(donor2);

        // 2 Verified Receivers (NGOs / Shelters)
        User receiver1 = new User("Aashray Child Care & Orphanage", "aashray.shelter@gmail.com", encodedDefaultPassword, Role.RECEIVER_ORG);
        receiver1.setVerified(true);
        receiver1 = userRepository.save(receiver1);

        User receiver2 = new User("Karuna Animal Welfare Shelter", "karuna.rescue@gmail.com", encodedDefaultPassword, Role.RECEIVER_ORG);
        receiver2.setVerified(true);
        receiver2 = userRepository.save(receiver2);

        // 1 Pending Receiver (allows demonstrating admin approval workflow live!)
        User pendingReceiver = new User("Prerna Food For All Foundation", "prerna.foundation@gmail.com", encodedDefaultPassword, Role.RECEIVER_ORG);
        pendingReceiver.setVerified(false);
        userRepository.save(pendingReceiver);

        // 2 Volunteers
        User volunteer1 = new User("Aarav Sharma (Fast Responder)", "aarav.volunteer@gmail.com", encodedDefaultPassword, Role.VOLUNTEER);
        volunteer1.setVerified(true);
        volunteer1 = userRepository.save(volunteer1);

        User volunteer2 = new User("Sneha Reddy (Community Courier)", "sneha.volunteer@gmail.com", encodedDefaultPassword, Role.VOLUNTEER);
        volunteer2.setVerified(true);
        volunteer2 = userRepository.save(volunteer2);

        // 3. Create Real-Life Realistic Donations
        LocalDateTime now = LocalDateTime.now();

        // Donation 1: Fresh Veg Biryani (Available, fresh food countdown badge)
        Donation d1 = new Donation();
        d1.setTitle("Fresh Veg Hyderabadi Biryani & Mirchi Ka Salan");
        d1.setDescription("Surplus wedding banquet buffet food. Freshly prepared, hygienically sealed in food-grade thermal containers. Ready for immediate community distribution.");
        d1.setType(DonationType.FOOD);
        d1.setQuantity(45);
        d1.setQuantityUnit("meals");
        d1.setPickupLocation("Taj Krishna Banquet Hall, Road No. 1, Banjara Hills, Hyderabad");
        d1.setLatitude(17.4156);
        d1.setLongitude(78.4357);
        d1.setFoodPreparedAt(now.minusHours(2));
        d1.setExpiryDate(now.plusHours(4));
        d1.setAllergens("Contains Dairy (Ghee/Paneer), Nuts (Cashews)");
        d1.setStorageInstructions("Keep sealed in insulated containers. Consume warm within 4 hours.");
        d1.setStatus(DonationStatus.AVAILABLE);
        d1.setDonor(donor1);
        donationRepository.save(d1);

        // Donation 2: Steamed Breakfast Packets (Available)
        Donation d2 = new Donation();
        d2.setTitle("Steamed Idli, Medu Vada & Hot Sambar Packets");
        d2.setDescription("Fresh breakfast buffet surplus. Individually packed with coconut chutney and sambar sachets.");
        d2.setType(DonationType.FOOD);
        d2.setQuantity(30);
        d2.setQuantityUnit("packets");
        d2.setPickupLocation("Madhapur Food Plaza, Near Hitec City Metro, Hyderabad");
        d2.setLatitude(17.4483);
        d2.setLongitude(78.3742);
        d2.setFoodPreparedAt(now.minusHours(1));
        d2.setExpiryDate(now.plusHours(5));
        d2.setAllergens("Gluten Free (Prepared in standard kitchen)");
        d2.setStorageInstructions("Store dry and warm.");
        d2.setStatus(DonationStatus.AVAILABLE);
        d2.setDonor(donor2);
        donationRepository.save(d2);

        // Donation 3: Warm Winter Blankets (Available Goods)
        Donation d3 = new Donation();
        d3.setTitle("Warm Winter Blankets & Fleece Bedding Sets");
        d3.setDescription("High quality sanitized woolen blankets and thermal fleece sheets collected from seasonal community drive. Suitable for elder shelters and children's homes.");
        d3.setType(DonationType.GOODS);
        d3.setQuantity(25);
        d3.setQuantityUnit("sets");
        d3.setPickupLocation("Jubilee Hills Community Center, Road No. 36, Hyderabad");
        d3.setLatitude(17.4319);
        d3.setLongitude(78.4073);
        d3.setExpiryDate(now.plusDays(30));
        d3.setStorageInstructions("Packed in waterproof protective bags.");
        d3.setStatus(DonationStatus.AVAILABLE);
        d3.setDonor(donor2);
        donationRepository.save(d3);

        // Donation 4: Claimed Chapati & Dal Kits (In-progress Volunteer Mission with Handover Code)
        Donation d4 = new Donation();
        d4.setTitle("Whole Wheat Chapati & Mixed Vegetable Dal Kits");
        d4.setDescription("Nutritious freshly rolled rotis and vegetable dal. Claimed by Aashray Child Care Home, currently dispatched with volunteer.");
        d4.setType(DonationType.FOOD);
        d4.setQuantity(35);
        d4.setQuantityUnit("meals");
        d4.setPickupLocation("Grand Green Banquet, Gachibowli, Hyderabad");
        d4.setLatitude(17.4401);
        d4.setLongitude(78.3489);
        d4.setFoodPreparedAt(now.minusHours(2));
        d4.setExpiryDate(now.plusHours(3));
        d4.setAllergens("Contains Wheat (Gluten)");
        d4.setStorageInstructions("Insulated transit box.");
        d4.setStatus(DonationStatus.CLAIMED);
        d4.setDonor(donor1);
        d4 = donationRepository.save(d4);

        // Claim for Donation 4
        Claim claim1 = new Claim();
        claim1.setDonation(d4);
        claim1.setReceiver(receiver1);
        claim1.setQuantity(35);
        claim1.setStatus(ClaimStatus.ACTIVE);
        claimRepository.save(claim1);

        // Active Mission for Donation 4
        Mission mission1 = new Mission();
        mission1.setDonation(d4);
        mission1.setReceiver(receiver1);
        mission1.setVolunteer(volunteer1);
        mission1.setStatus(MissionStatus.PICKED_UP);
        mission1.setHandoverCode("SHY-8492");
        mission1.setAcceptedAt(now.minusMinutes(35));
        missionRepository.save(mission1);

        // Donation 5: Completed Historical Donation (Shows on Impact Analytics and Donor Certificate)
        Donation d5 = new Donation();
        d5.setTitle("School Stationary Sets & Kids Drawing Notebooks");
        d5.setDescription("Sets containing spiral notebooks, pencil boxes, geometric kits, and art crayons for primary students.");
        d5.setType(DonationType.GOODS);
        d5.setQuantity(50);
        d5.setQuantityUnit("sets");
        d5.setPickupLocation("Begumpet Rotary Club, Hyderabad");
        d5.setLatitude(17.4447);
        d5.setLongitude(78.4664);
        d5.setExpiryDate(now.plusDays(60));
        d5.setStatus(DonationStatus.COMPLETED);
        d5.setDonor(donor1);
        d5 = donationRepository.save(d5);

        // Claim for Donation 5
        Claim claim2 = new Claim();
        claim2.setDonation(d5);
        claim2.setReceiver(receiver1);
        claim2.setQuantity(50);
        claim2.setStatus(ClaimStatus.COMPLETED);
        claimRepository.save(claim2);

        // Completed Mission for Donation 5
        Mission mission2 = new Mission();
        mission2.setDonation(d5);
        mission2.setReceiver(receiver1);
        mission2.setVolunteer(volunteer2);
        mission2.setStatus(MissionStatus.COMPLETED);
        mission2.setHandoverCode("SHY-3174");
        mission2.setAcceptedAt(now.minusDays(1).minusHours(2));
        mission2.setCompletedAt(now.minusDays(1));
        missionRepository.save(mission2);

        // 4. Create Shelter Needs (Community Board)
        Need need1 = new Need();
        need1.setTitle("Urgent: 20 Woolen Blankets and Milk Powder for Toddlers");
        need1.setDescription("Our shelter cares for 28 young children. With colder night temperatures, we urgently require warm fleece blankets and nutritional milk formula.");
        need1.setType(DonationType.GOODS);
        need1.setQuantity(20);
        need1.setLocation("Aashray Child Care Home, Begumpet, Hyderabad");
        need1.setStatus(NeedStatus.OPEN);
        need1.setOrganization(receiver1);
        needRepository.save(need1);

        Need need2 = new Need();
        need2.setTitle("Dry Dog Food (Pedigree) & Antiseptic Bandages for Rescued Animals");
        need2.setDescription("We have 42 rescued and recovering stray animals under medical rehabilitation. Urgently need puppy dry food kibble and antiseptic medical bandages.");
        need2.setType(DonationType.GOODS);
        need2.setQuantity(15);
        need2.setLocation("Karuna Animal Rescue Center, Secunderabad");
        need2.setStatus(NeedStatus.OPEN);
        need2.setOrganization(receiver2);
        needRepository.save(need2);

        System.out.println("Clean presentation demo data seeded successfully!");
    }
}
